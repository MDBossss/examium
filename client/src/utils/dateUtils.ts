export function getTimeAgo(timestamp: Date) {
    const currentDate = new Date();
    const previousDate = new Date(timestamp);
    const timeDifference = currentDate.getTime() - previousDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
  
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
  
    const minutes = Math.floor(seconds / 60);
  
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
  
    const hours = Math.floor(minutes / 60);
  
    if (hours < 24) {
      return `${hours} hours ago`;
    }
  
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }
  