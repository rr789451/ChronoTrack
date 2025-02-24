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
  static getTimers = async (): Promise<Timer[]> => {
    try {
      const timersJson = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
      if (!timersJson) return [];
      
      const timers: Timer[] = JSON.parse(timersJson);
      const timerStates = await Promise.all(
        timers.map(async (timer) => {
          const stateJson = await AsyncStorage.getItem(`timer_${timer.id}`);
          if (stateJson) {
            const state: TimerState = JSON.parse(stateJson);
            return {
              ...timer,
              status: state.status,
              timeRemaining: state.timeRemaining
            };
          }
          return {
            ...timer,
            status: timer.status || 'idle',
            timeRemaining: timer.timeRemaining !== undefined ? timer.timeRemaining : timer.duration
          };
        })
      );
      
      return timerStates;
    } catch (error) {
      console.error('Failed to get timers:', error);
      return [];
    }
  };

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
        state.timeRemaining = timeRemaining;
      } else {
        state = {
          id,
          status,
          timeRemaining,
          halfwayAlertShown: false
        };
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
          timeRemaining: state.timeRemaining
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
      if (historyJson) {
        return JSON.parse(historyJson);
      }
      return [];
    } catch (error) {
      console.error('Failed to get timer history:', error);
      return [];
    }
  };

  static addTimerToHistory = async (timer: CompletedTimer): Promise<void> => {
    try {
      const history = await this.getTimerHistory();
      history.unshift(timer); 
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
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
      const categoryTimers = timers.filter(timer => timer.category === category);
      
      for (const timer of categoryTimers) {
        if (timer.status !== 'completed') {
          await this.updateTimerState(timer.id, 'running', timer.timeRemaining || timer.duration);
        }
      }
    } catch (error) {
      console.error('Failed to start category timers:', error);
      throw error;
    }
  };

  static pauseCategoryTimers = async (category: string): Promise<void> => {
    try {
      const timers = await this.getTimers();
      const categoryTimers = timers.filter(timer => 
        timer.category === category && timer.status === 'running'
      );
      
      for (const timer of categoryTimers) {
        await this.updateTimerState(timer.id, 'paused', timer.timeRemaining || 0);
      }
    } catch (error) {
      console.error('Failed to pause category timers:', error);
      throw error;
    }
  };

  static resetCategoryTimers = async (category: string): Promise<void> => {
    try {
      const timers = await this.getTimers();
      const categoryTimers = timers.filter(timer => timer.category === category);
      
      for (const timer of categoryTimers) {
        await this.updateTimerState(timer.id, 'idle', timer.duration);
      }
    } catch (error) {
      console.error('Failed to reset category timers:', error);
      throw error;
    }
  };
}

export default TimerService;