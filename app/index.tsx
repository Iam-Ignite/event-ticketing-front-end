import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useEvents } from '../context/EventContext';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

export default function EventListScreen() {
  const { events, isLoading, error, selectEvent } = useEvents();
  const router = useRouter();
  
  
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading events...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  
  const handleEventPress = (eventId: string) => {
    selectEvent(eventId);
    router.push(`/event/${eventId}`);
  };
  
  const renderEventItem = ({ item }:any) => {
    const formattedDate = format(new Date(item.date), 'MMM dd, yyyy · h:mm a');
    const isSoldOut = item.ticketsAvailable === 0;
    
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => handleEventPress(item.id)}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.eventImage} 
          resizeMode="cover"
        />
        <View style={styles.eventDetails}>
          <Text style={styles.eventName}>{item.name}</Text>
          <Text style={styles.eventDate}>{formattedDate}</Text>
          <Text style={styles.eventLocation}>{item.location}</Text>
          
          <View style={styles.ticketInfo}>
            {isSoldOut ? (
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            ) : (
              <>
                <Text style={styles.ticketsAvailable}>
                  {item.ticketsAvailable} tickets available
                </Text>
                <Text style={styles.eventPrice}>${item.price.toFixed(2)}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
  listContainer: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventDetails: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ticketsAvailable: {
    fontSize: 14,
    color: '#666',
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  soldOutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});