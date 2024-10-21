// Create a global event bus to allow components to communicate with each other.
import mitt from 'mitt'

// Create a global event bus
export const EventBus = mitt()
