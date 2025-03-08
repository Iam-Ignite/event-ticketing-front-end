import { Stack } from 'expo-router';
import { EventProvider } from '../context/EventContext';

export default function RootLayout() {
  return (
    <EventProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Events',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }} 
        />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            title: 'Event Details',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }} 
        />
        <Stack.Screen 
          name="confirmation" 
          options={{ 
            title: 'Order Confirmation',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackVisible: false, // Prevent going back to keep state consistent
          }} 
        />
      </Stack>
    </EventProvider>
  );
}