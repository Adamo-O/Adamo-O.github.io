accelPosition = false;
const accelSwitch = (img) => {
    if (!accelPosition) {
        img.src = "Images/L Position.png";
        accelPosition = true;
    }
    else {
        img.src = "Images/L Acceleration.png";
        accelPosition = false;
    }
}