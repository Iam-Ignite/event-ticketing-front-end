import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Define types
interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  price: number;
  ticketsAvailable: number;
  image: string;
}

interface Order {
  eventId: string;
  eventName: string;
  eventDate: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
}

interface State {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  currentEvent: Event | null;
  order: Order | null;
}

// Initial state
const initialState: State = {
  events: [],
  isLoading: true,
  error: null,
  currentEvent: null,
  order: null,
};

// Action types
enum ActionTypes {
  FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE',
  SELECT_EVENT = 'SELECT_EVENT',
  PURCHASE_TICKETS = 'PURCHASE_TICKETS',
  RESET_ORDER = 'RESET_ORDER',
}

// Define action interfaces
interface FetchEventsSuccessAction {
  type: ActionTypes.FETCH_EVENTS_SUCCESS;
  payload: Event[];
}

interface FetchEventsFailureAction {
  type: ActionTypes.FETCH_EVENTS_FAILURE;
  payload: string;
}

interface SelectEventAction {
  type: ActionTypes.SELECT_EVENT;
  payload: Event | null;
}

interface PurchaseTicketsAction {
  type: ActionTypes.PURCHASE_TICKETS;
  payload: { eventId: string; quantity: number };
}

interface ResetOrderAction {
  type: ActionTypes.RESET_ORDER;
}

type Action = 
  | FetchEventsSuccessAction
  | FetchEventsFailureAction
  | SelectEventAction
  | PurchaseTicketsAction
  | ResetOrderAction;

// Reducer function
const eventReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.payload,
        isLoading: false,
      };
    case ActionTypes.FETCH_EVENTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case ActionTypes.SELECT_EVENT:
      return {
        ...state,
        currentEvent: action.payload,
      };
    case ActionTypes.PURCHASE_TICKETS:
      const { eventId, quantity } = action.payload;
      // Update events array with new ticket availability
      const updatedEvents = state.events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            ticketsAvailable: event.ticketsAvailable - quantity,
          };
        }
        return event;
      });
      
      // Get the current event details
      const event = state.events.find(e => e.id === eventId);
      
      if (!event) {
        return state;
      }
      
      // Create order
      const order: Order = {
        eventId,
        eventName: event.name,
        eventDate: event.date,
        quantity,
        totalPrice: event.price * quantity,
        purchaseDate: new Date().toISOString(),
      };
      
      return {
        ...state,
        events: updatedEvents,
        currentEvent: state.currentEvent ? {
          ...state.currentEvent,
          ticketsAvailable: state.currentEvent.ticketsAvailable - quantity,
        } : null,
        order,
      };
    case ActionTypes.RESET_ORDER:
      return {
        ...state,
        order: null,
      };
    default:
      return state;
  }
};

// Define context type
interface EventContextType extends State {
  selectEvent: (eventId: string) => void;
  purchaseTickets: (eventId: string, quantity: number) => Promise<void>;
  resetOrder: () => void;
}

// Create context
export const EventContext = createContext<EventContextType | undefined>(undefined);

// Props for provider
interface EventProviderProps {
  children: ReactNode;
}

// GraphQL queries
const EVENTS_QUERY = `
  query GetEvents {
    getEvents {
      id
      name
      date
      location
      description
      price
      ticketsAvailable
      image
    }
  }
`;
const PURCHASE_TICKETS_MUTATION = `
  mutation PurchaseTickets($eventId: String!, $quantity: Float!) {
    purchaseTickets(eventId: $eventId, quantity: $quantity) {
      orderNumber
      event {
        id
        name
        date
        location
        description
        price
        ticketsAvailable
        image
      }
      quantity
    }
  }
`;


// Context provider
export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  
  // Fetch events from GraphQL API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: EVENTS_QUERY
          }),
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        dispatch({
          type: ActionTypes.FETCH_EVENTS_SUCCESS,
          payload: result.data.getEvents,
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        dispatch({
          type: ActionTypes.FETCH_EVENTS_FAILURE,
          payload: error instanceof Error ? error.message : 'Failed to fetch events',
        });
      }
    };
    
    fetchEvents();
  }, []);
  
  // Action creators
  const selectEvent = (eventId: string): void => {
    const event = state.events.find(e => e.id === eventId) || null;
    dispatch({
      type: ActionTypes.SELECT_EVENT,
      payload: event,
    });
  };
  
  const purchaseTickets = async (eventId: string, quantity: number): Promise<void> => {
    const event = state.events.find(e => e.id === eventId);
    
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    
    // Validation
    if (quantity > event.ticketsAvailable) {
      return Promise.reject(new Error('Not enough tickets available'));
    }
    
    if (quantity <= 0) {
      return Promise.reject(new Error('Quantity must be greater than zero'));
    }
    
    try {
      // Call the GraphQL API with quantity as Float
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: PURCHASE_TICKETS_MUTATION,
          variables: {
            eventId,
            quantity: parseFloat(quantity.toString()) // Ensure it's treated as a float
          }
        }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      // Now update the local state with the returned data
      dispatch({
        type: ActionTypes.PURCHASE_TICKETS,
        payload: { eventId, quantity },
      });
      
      return result.data.purchaseTickets;
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      throw error;
    }
  };
  
  const resetOrder = (): void => {
    dispatch({ type: ActionTypes.RESET_ORDER });
  };
  
  return (
    <EventContext.Provider
      value={{
        ...state,
        selectEvent,
        purchaseTickets,
        resetOrder,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the event context
export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};