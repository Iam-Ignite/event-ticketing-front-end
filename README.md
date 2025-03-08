# Event Ticketing App

A simple event ticketing application where users can view events and purchase tickets.

## Project Overview

This React Native application (using Expo Router) allows users to:
- View a list of upcoming events
- See event details
- Purchase tickets for events
- View order confirmation

### Features

- View all events with name, date, location, and ticket availability
- View detailed information about each event
- Select quantity of tickets to purchase
- See "Sold Out" status for events with no available tickets
- Receive order confirmation with order number, event details, and purchase summary

## Mock Data Version

This is a frontend-only version that uses mock data instead of an actual backend. All data and operations are simulated within the app.

### Design Decisions

1. **State Management**: Used React Context API for state management. This provides a simple and effective way to manage application state, while being easy to replace with Redux if needed in the future.

2. **Routing**: Used Expo Router for file-based routing, which simplifies navigation and route management compared to React Navigation.

3. **Mock Data Structure**: Created mock data that simulates what would be returned from a backend API.

4. **UI Flow**: Implemented a natural flow from event list → event details → purchase → confirmation.

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
```bash
cd event-ticketing-app
```

2. Install dependencies
```bash
npm install
# or# event-ticketing-front-end
