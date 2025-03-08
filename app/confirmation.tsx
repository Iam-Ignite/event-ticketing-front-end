import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEvents } from '../context/EventContext';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

export default function OrderConfirmationScreen() {
  const { order, resetOrder } = useEvents();
  const router = useRouter();
  
  if (!order) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No order information found</Text>
      </View>
    );
  }
  
  const formattedDate = format(new Date(order.eventDate), 'EEEE, MMMM dd, yyyy');
  const formattedTime = format(new Date(order.eventDate), 'h:mm a');
  
  const handleBackToEvents = () => {
    resetOrder();
    router.replace('/');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.confirmationHeader}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
        </View>
        
        
        <View style={styles.separator} />
        
        <Text style={styles.sectionHeader}>Event Details</Text>
        <Text style={styles.eventDetailName}>{order.eventName}</Text>
        <Text style={styles.eventDetailDate}>{formattedDate} at {formattedTime}</Text>
        
        <View style={styles.separator} />
        
        <Text style={styles.sectionHeader}>Purchase Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tickets:</Text>
          <Text style={styles.summaryValue}>{order.quantity}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Price:</Text>
          <Text style={styles.totalValue}>${order.totalPrice.toFixed(2)}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <Text style={styles.thankYouText}>
          Thank you for your purchase!
        </Text>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToEvents}
        >
          <Text style={styles.backButtonText}>
            Back to Events
          </Text>
        </TouchableOpacity>
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
  contentContainer: {
    padding: 16,
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 60,
    color: '#4CAF50',
    marginBottom: 8,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderNumberText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetailDate: {
    fontSize: 16,
    color: '#666',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  thankYouText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});