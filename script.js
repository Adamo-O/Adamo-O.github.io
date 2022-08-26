// Swap acceleration image on hover
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

// Highlight section in navbar on visit
current = '';
window.onscroll = () => {
    
    document.querySelectorAll('.navSection').forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.id;
        }
    });

    document.querySelectorAll('.nav-link').forEach(linkItem => {
        linkItem.classList.remove('active');
        if (linkItem.getAttribute('href').includes(current)) {
            linkItem.classList.add('active');
        }
    })
}