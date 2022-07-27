const calculate_time_left = (epoch_time) => {
  var next_d = new Date(0)
  next_d.setUTCSeconds(epoch_time)

  var start = Date.now()
  var difference = next_d-start

  let timeLeft = {minutes:0, hours:0, seconds:0, days:0};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft
}

  const seconds_until = (epoch_time) => {
      var time_left = calculate_time_left(epoch_time)
      return (time_left.minutes + (time_left.hours * 60)) * 60 + time_left.seconds;
  }

  const minutes_until = (epoch_time) => {
      var time_left = calculate_time_left(epoch_time)
      return time_left.minutes + (time_left.hours * 60);
  }


const random_int_from_interval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const timer_components = (time_until, additive_text) => {
  const timerComponents = [];
  if (time_until != undefined) {
    var difference = calculate_time_left(time_until)

    Object.keys(difference).forEach((interval) => {
        
        if (!difference[interval]) {
          return;
        }

        timerComponents.push(
          <span key={interval}>
            {difference[interval]} {interval}{" "}
          </span>
        );
      });

      if(timerComponents.length > 0) {
        timerComponents.push(
          <span key="appended_text">
            {additive_text}
          </span>
        );
      }
    }
  return timerComponents;
}

export {calculate_time_left, random_int_from_interval, timer_components, seconds_until, minutes_until};