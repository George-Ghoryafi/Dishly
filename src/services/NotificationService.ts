import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private currentNotificationId: string | null = null;
  private timerInterval: NodeJS.Timeout | null = null;
  private lastUpdateTime: number = 0;

  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Failed to get notification permissions');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }



  async startTimerNotification(
    recipeName: string,
    stepTitle: string,
    totalSeconds: number,
    onComplete?: () => void
  ) {
    try {
      // Clear any existing timer
      this.stopTimerNotification();

      let remainingSeconds = totalSeconds;
      const originalDuration = totalSeconds;
      
      // Create initial rich notification
      this.currentNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🍳 ${recipeName}`,
          body: this.createRichNotificationBody(stepTitle, remainingSeconds, originalDuration),
          sound: false,
          sticky: true, // Keep notification persistent
          priority: 'high',
          data: {
            type: 'cooking-timer',
            recipeName,
            stepTitle,
            remainingSeconds,
            originalDuration,
          },
        },
        trigger: null, // Show immediately
      });

              // Start background timer updates with live progress (United Airlines style)
        this.timerInterval = setInterval(async () => {
          remainingSeconds--;
          const currentTime = Date.now();

          if (remainingSeconds <= 0) {
            // Timer finished
            this.stopTimerNotification();
            
            // Show completion notification with rich styling
            const completionBody = [
              `✅ "${stepTitle}"`,
              `━━━━━━━━━━━━━━━━━━━━━━━`,
              `████████████████ 100%`,
              `🎉 Step completed!`,
              ``,
              `👆 Tap to continue cooking`
            ].join('\n');

            await Notifications.scheduleNotificationAsync({
              content: {
                title: '⏰ Timer Complete!',
                body: completionBody,
                sound: true,
                sticky: true,
                priority: 'max',
                data: {
                  type: 'cooking-complete',
                  stepTitle,
                },
              },
              trigger: null,
            });

            if (onComplete) {
              onComplete();
            }
            return;
          }

          // Throttle updates in the first few seconds, then update every second as time gets critical
          const shouldUpdate = remainingSeconds <= 60 || (currentTime - this.lastUpdateTime) >= 1000;
          
          if (shouldUpdate) {
            this.lastUpdateTime = currentTime;
            
            // Update notification with live progress and dynamic priority
            if (this.currentNotificationId) {
              await Notifications.dismissNotificationAsync(this.currentNotificationId);
            }

            // Dynamic priority based on urgency (like airline notifications)
            let priority = 'normal';
            if (remainingSeconds <= 30) priority = 'max';
            else if (remainingSeconds <= 60) priority = 'high';

            this.currentNotificationId = await Notifications.scheduleNotificationAsync({
              content: {
                title: `🍳 ${recipeName}`,
                body: this.createRichNotificationBody(stepTitle, remainingSeconds, originalDuration),
                sound: false,
                sticky: true,
                priority: priority,
                data: {
                  type: 'cooking-timer',
                  recipeName,
                  stepTitle,
                  remainingSeconds,
                  originalDuration,
                  urgency: remainingSeconds <= 60 ? 'high' : 'normal',
                },
              },
              trigger: null,
            });
          }
        }, 1000);
    } catch (error) {
      console.error('Error starting timer notification:', error);
    }
  }

  async stopTimerNotification() {
    try {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      if (this.currentNotificationId) {
        await Notifications.dismissNotificationAsync(this.currentNotificationId);
        this.currentNotificationId = null;
      }

      // Cancel all scheduled cooking notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      for (const notification of scheduledNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error stopping timer notification:', error);
    }
  }

  async showCookingCompleteNotification(recipeName: string) {
    try {
      const completionBody = [
        `🍽️ ${recipeName}`,
        ``,
        `████████████████ 100%`,
        `✅ All steps completed!`,
        ``,
        `🎉 Enjoy your delicious meal!`
      ].join('\n');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Cooking Complete!',
          body: completionBody,
          sound: true,
          sticky: true,
          priority: 'max',
          data: {
            type: 'cooking-finished',
            recipeName,
          },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing completion notification:', error);
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private createProgressBar(current: number, total: number, length: number = 20): string {
    const progress = Math.max(0, (total - current) / total);
    const filledLength = Math.floor(progress * length);
    const emptyLength = length - filledLength;
    
    // Use Unicode block characters for smoother progress bar
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);
    
    return filled + empty;
  }

  private createRichNotificationBody(stepTitle: string, remainingSeconds: number, originalDuration: number): string {
    const timeFormatted = this.formatTime(remainingSeconds);
    const progressBar = this.createProgressBar(remainingSeconds, originalDuration, 16);
    const progressPercent = Math.round(((originalDuration - remainingSeconds) / originalDuration) * 100);
    
    // Add urgency indicators based on time remaining
    let statusIcon = '🟢';
    let statusText = 'On Track';
    
    if (remainingSeconds <= 30) {
      statusIcon = '🔴';
      statusText = 'Almost Done';
    } else if (remainingSeconds <= 60) {
      statusIcon = '🟡';
      statusText = 'Final Minute';
    }
    
    // Create airline-style notification format with rich details
    const lines = [
      `${statusIcon} ${stepTitle}`,
      `━━━━━━━━━━━━━━━━━━━━━━━`,
      `${progressBar} ${progressPercent}%`,
      `⏳ ${timeFormatted} remaining • ${statusText}`,
      ``,
      `🔥 Active cooking timer`
    ];
    
    return lines.join('\n');
  }

  // Method to handle notification responses (when user taps notification)
  setupNotificationResponseHandler(onResponse: (response: any) => void) {
    return Notifications.addNotificationResponseReceivedListener(onResponse);
  }


}

export default new NotificationService(); 