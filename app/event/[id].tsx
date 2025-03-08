import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEvents } from '../../context/EventContext';
import { format } from 'date-fns';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { currentEvent, purchaseTickets } = useEvents();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const router = useRouter();
  
  if (!currentEvent) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Event not found</Text>
      </View>
    );
  }
  
  const formattedDate = format(new Date(currentEvent.date), 'EEEE, MMMM dd, yyyy');
  const formattedTime = format(new Date(currentEvent.date), 'h:mm a');
  const isSoldOut = currentEvent.ticketsAvailable === 0;
  
  const increaseQuantity = () => {
    if (ticketQuantity < currentEvent.ticketsAvailable) {
      setTicketQuantity(ticketQuantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1);
    }
  };
  
  const handlePurchase = async () => {
    try {
      if (ticketQuantity > currentEvent.ticketsAvailable) {
        Alert.alert('Error', 'Not enough tickets available');
        return;
      }
    
      await purchaseTickets(currentEvent.id, ticketQuantity);
      router.push('/confirmation');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: currentEvent.image }} 
        style={styles.eventDetailImage} 
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.eventDetailName}>{currentEvent.name}</Text>
        <Text style={styles.eventDetailDate}>{formattedDate} at {formattedTime}</Text>
        <Text style={styles.eventDetailLocation}>{currentEvent.location}</Text>
        
        <View style={styles.separator} />
        
        <Text style={styles.descriptionHeader}>About this event</Text>
        <Text style={styles.eventDescription}>{currentEvent.description}</Text>
        
        <View style={styles.separator} />
        
        <Text style={styles.ticketHeader}>Tickets</Text>
        <Text style={styles.ticketPrice}>${currentEvent.price.toFixed(2)} per ticket</Text>
        
        {isSoldOut ? (
          <View style={styles.soldOutContainer}>
            <Text style={styles.soldOutTextLarge}>SOLD OUT</Text>
          </View>
        ) : (
          <>
            <Text style={styles.availabilityText}>
              {currentEvent.ticketsAvailable} tickets available
            </Text>
            
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={decreaseQuantity}
                  disabled={ticketQuantity <= 1}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityValue}>{ticketQuantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={increaseQuantity}
                  disabled={ticketQuantity >= currentEvent.ticketsAvailable}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>
                ${(currentEvent.price * ticketQuantity).toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.purchaseButton}
              onPress={handlePurchase}
            >
              <Text style={styles.purchaseButtonText}>
                Purchase Tickets
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetailImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  eventDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetailDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  eventDetailLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  ticketHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  purchaseButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  soldOutContainer: {
    alignItems: 'center',
    marginVertical: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e74c3c',
    borderRadius: 8,
  },
  soldOutTextLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});