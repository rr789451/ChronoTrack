import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  halfwayAlert: boolean;
  status?: 'idle' | 'running' | 'paused' | 'completed';
  timeRemaining?: number;
}

export interface TimerState {
  id: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  timeRemaining: number;
  halfwayAlertShown: boolean;
}

export interface CompletedTimer {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: string;
}

const TIMERS_STORAGE_KEY = 'timers';
const CATEGORIES_STORAGE_KEY = 'categories';
const HISTORY_STORAGE_KEY = 'timerHistory';

export class TimerService {
  static async getTimers(): Promise<Timer[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const timersJson = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
      return timersJson ? JSON.parse(timersJson) : [];
    } catch (error) {
      console.error('Failed to get timers:', error);
      return [];
    }
  }

  static saveTimer = async (timer: Timer): Promise<void> => {
    try {
      const timers = await this.getTimers();
      const newTimer = {
        ...timer,
        status: timer.status || 'idle',
        timeRemaining: timer.timeRemaining !== undefined ? timer.timeRemaining : timer.duration
      };
      
      const index = timers.findIndex(t => t.id === timer.id);
      
      if (index !== -1) {
        timers[index] = newTimer;
      } else {
        timers.push(newTimer);
      }
      
      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
      
      await AsyncStorage.setItem(`timer_${timer.id}`, JSON.stringify({
        id: timer.id,
        status: timer.status || 'idle',
        timeRemaining: timer.timeRemaining !== undefined ? timer.timeRemaining : timer.duration,
        halfwayAlertShown: false
      }));
    } catch (error) {
      console.error('Failed to save timer:', error);
      throw error;
    }
  };

  static updateTimer = async (timer: Timer): Promise<void> => {
    try {
      const timers = await this.getTimers();
      const index = timers.findIndex(t => t.id === timer.id);
      
      if (index !== -1) {
        timers[index] = timer;
        await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
      }
      
      await AsyncStorage.setItem(`timer_${timer.id}`, JSON.stringify({
        id: timer.id,
        status: timer.status || 'idle',
        timeRemaining: timer.timeRemaining,
        halfwayAlertShown: false
      }));
    } catch (error) {
      console.error('Failed to update timer:', error);
      throw error;
    }
  };

  static updateTimerState = async (
    id: string, 
    status: 'idle' | 'running' | 'paused' | 'completed', 
    timeRemaining: number
  ): Promise<void> => {
    try {
      const stateJson = await AsyncStorage.getItem(`timer_${id}`);
      let state: TimerState;
      
      if (stateJson) {
        state = JSON.parse(stateJson);
        state.status = status;
        
        state.timeRemaining = status === 'completed' ? 0 : timeRemaining;
      } else {
        state = {
          id,
          status,
          timeRemaining: status === 'completed' ? 0 : timeRemaining,
          halfwayAlertShown: false
        };
      }
      
      const timers = await this.getTimers();
      const index = timers.findIndex(t => t.id === id);
      
      if (index !== -1) {
        timers[index] = {
          ...timers[index],
          status,
          timeRemaining: status === 'completed' ? 0 : timeRemaining
        };
        
        await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
      }
      
      await AsyncStorage.setItem(`timer_${id}`, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to update timer state:', error);
      throw error;
    }
  };

  static getTimerState = async (id: string): Promise<TimerState | null> => {
    try {
      const stateJson = await AsyncStorage.getItem(`timer_${id}`);
      if (stateJson) {
        return JSON.parse(stateJson);
      }
      return null;
    } catch (error) {
      console.error('Failed to get timer state:', error);
      return null;
    }
  };

  static deleteTimer = async (timerId: string): Promise<void> => {
    try {
      const timers = await this.getTimers();
      const filteredTimers = timers.filter(timer => timer.id !== timerId);
      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(filteredTimers));
      
      await AsyncStorage.removeItem(`timer_${timerId}`);
    } catch (error) {
      console.error('Failed to delete timer:', error);
      throw error;
    }
  };

  static getTimerById = async (timerId: string): Promise<Timer | null> => {
    try {
      const timers = await this.getTimers();
      const timer = timers.find(t => t.id === timerId);
      if (!timer) return null;
      
      const stateJson = await AsyncStorage.getItem(`timer_${timerId}`);
      if (stateJson) {
        const state: TimerState = JSON.parse(stateJson);
        
        return {
          ...timer,
          status: state.status,
          timeRemaining: state.status === 'completed' ? 0 : state.timeRemaining
        };
      }
      
      return timer;
    } catch (error) {
      console.error('Failed to get timer by ID:', error);
      return null;
    }
  };

  static getCategories = async (): Promise<string[]> => {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (categoriesJson) {
        return JSON.parse(categoriesJson);
      }
      return [];
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  };

  static saveCategory = async (category: string): Promise<void> => {
    try {
      const categories = await this.getCategories();
      
      if (!categories.includes(category)) {
        categories.push(category);
        await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      throw error;
    }
  };

  static getTimerHistory = async (): Promise<CompletedTimer[]> => {
    try {
      const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      
      if (!historyJson) {
        return [];
      }
      
      const history = JSON.parse(historyJson);
      return history;
    } catch (error) {
      return [];
    }
  };

  static addTimerToHistory = async (timer: CompletedTimer): Promise<void> => {
    try {
      
      const history = await this.getTimerHistory();
      
      history.unshift(timer);
      
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      
      const timers = await this.getTimers();
      const index = timers.findIndex(t => t.id === timer.id);
      
      if (index !== -1) {
        timers[index] = {
          ...timers[index],
          status: 'completed',
          timeRemaining: 0
        };
        await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
      } else {
        console.warn(`Warning: Timer ${timer.id} not found in main storage`);
      }
      
      const timerState = {
        id: timer.id,
        status: 'completed',
        timeRemaining: 0,
        halfwayAlertShown: true
      };
      
      await AsyncStorage.setItem(`timer_${timer.id}`, JSON.stringify(timerState));
      
    } catch (error) {
      console.error('Failed to add timer to history:', error);
      throw error;
    }
  };

  static clearTimerHistory = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear timer history:', error);
      throw error;
    }
  };
  
  static startCategoryTimers = async (category: string): Promise<void> => {
    try {
      const timers = await this.getTimers();
      const timerStates = await Promise.all(
        timers
          .filter(timer => timer.category === category && timer.status !== 'completed')
          .map(async timer => {
            const stateJson = await AsyncStorage.getItem(`timer_${timer.id}`);
            const state = stateJson ? JSON.parse(stateJson) : null;
            return { 
              timer, 
              currentTimeRemaining: state?.timeRemaining ?? timer.timeRemaining ?? timer.duration,
              halfwayAlertShown: state?.halfwayAlertShown ?? false
            };
          })
      );

      const updatedTimers = timers.map(timer => {
        if (timer.category === category && timer.status !== 'completed') {
          const timerState = timerStates.find(state => state.timer.id === timer.id);
          return { 
            ...timer, 
            status: 'running',
            timeRemaining: timerState?.currentTimeRemaining ?? timer.timeRemaining ?? timer.duration
          };
        }
        return timer;
      });

      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(updatedTimers));

      for (const timerState of timerStates) {
        await AsyncStorage.setItem(`timer_${timerState.timer.id}`, JSON.stringify({
          id: timerState.timer.id,
          status: 'running',
          timeRemaining: timerState.currentTimeRemaining,
          halfwayAlertShown: timerState.halfwayAlertShown
        }));
      }
    } catch (error) {
      console.error('Failed to start category timers:', error);
      throw error;
    }
  };

  static pauseCategoryTimers = async (category: string): Promise<void> => {
    try {
      
      const timers = await this.getTimers();
      
      const categoryRunningTimers = timers.filter(
        timer => timer.category === category && timer.status === 'running'
      );
      
      if (categoryRunningTimers.length === 0) {
        return; 
      }
      
      const updatedTimerStates = await Promise.all(
        categoryRunningTimers.map(async (timer) => {
          const stateJson = await AsyncStorage.getItem(`timer_${timer.id}`);
          let currentTimeRemaining = timer.duration; 
          let status = 'paused';
          
          if (stateJson) {
            try {
              const state = JSON.parse(stateJson);
              currentTimeRemaining = state.timeRemaining;
            } catch (e) {
              console.error(`Error parsing timer state for ${timer.id}:`, e);
            }
          }
          
          return {
            ...timer,
            status: 'paused',
            timeRemaining: currentTimeRemaining
          };
        })
      );
      
      const updatedTimers = timers.map(timer => {
        const updatedTimer = updatedTimerStates.find(t => t.id === timer.id);
        if (updatedTimer) {
          return updatedTimer;
        }
        return timer;
      });
      
      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(updatedTimers));
      
      for (const updatedTimer of updatedTimerStates) {
        const stateJson = await AsyncStorage.getItem(`timer_${updatedTimer.id}`);
        let halfwayAlertShown = false;
        
        if (stateJson) {
          try {
            const state = JSON.parse(stateJson);
            halfwayAlertShown = state.halfwayAlertShown;
          } catch (e) {
            console.error(`Error parsing timer state for ${updatedTimer.id}:`, e);
          }
        }
        
        const newState = {
          id: updatedTimer.id,
          status: 'paused',
          timeRemaining: updatedTimer.timeRemaining,
          halfwayAlertShown: halfwayAlertShown
        };
        
        await AsyncStorage.setItem(`timer_${updatedTimer.id}`, JSON.stringify(newState));
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to pause category timers:', error);
      throw error;
    }
  };

  static resetCategoryTimers = async (category: string): Promise<void> => {
    try {
      
      const timers = await this.getTimers();
      
      const categoryTimers = timers.filter(timer => timer.category === category);
      
      if (categoryTimers.length === 0) {
        return;
      }
      
      const updatedTimers = timers.map(timer => {
        if (timer.category === category) {
          return { 
            ...timer, 
            status: 'idle',
            timeRemaining: timer.duration
          };
        }
        return timer;
      });
  
      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(updatedTimers));
  
      for (const timer of categoryTimers) {
        const resetState = {
          id: timer.id,
          status: 'idle',
          timeRemaining: timer.duration,
          halfwayAlertShown: false
        };
        
        await AsyncStorage.setItem(`timer_${timer.id}`, JSON.stringify(resetState));
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to reset category timers:', error);
      throw error;
    }
  };
}

export default TimerService;