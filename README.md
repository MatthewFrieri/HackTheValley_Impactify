# Impactify 

## Inspiration 🤔
The brain, the body's command center, orchestrates every function, but damage to this vital organ in contact sports often goes unnoticed. Studies show that 99% of football players diagnosed with CTE, 87% of boxers have experienced at least one concussion, and 15-30% of hockey injuries are brain-related. If only there were a way for players and coaches to monitor the brain health of players before any long-term damage can occur.

## Our Solution💡
Impactify addresses brain health challenges in contact sports by integrating advanced hardware into helmets used in sports like hockey, boxing, and football. This hardware records all impacts sustained during training or games, capturing essential data from each session. The collected data provides valuable insights into an athlete's brain health, enabling them to monitor and assess their cognitive well-being. By staying informed about potential head injuries or concussion risks, athletes can take proactive measures to protect their health. Wether you're a player who wants to track their own brain health or a coach who wants to track all their players brain health Impactify has a solution for both. 

## How we built it 🛠️
Impactify leverages a mighty stack of technologies to optimize its development and performance. React was chosen for the front end due to its flexibility in building dynamic, interactive user interfaces, allowing for a seamless and responsive user experience. Django powers the backend, providing a robust and scalable framework for handling complex business logic, API development, and secure authentication. PostgreSQL was selected for data storage because of its reliability, advanced querying capabilities, and easy handling of large datasets. Last but not least, Docker was employed to manage dependencies across multiple devices. This helped maintain uniformity in the development and deployment processes, reducing the chances of environment-related issues.

On the hardware side, we used an ESP32 microprocessor connected to our team member's mobile hotspot, allowing the microprocessor to send data over the internet. The ESP32 was then connected to 4 pressure sensors and an accelerometer and readings from these sensors at fixed intervals. The data was sent over the internet to our web server for further processing. The parts were then soldered together and bound with hot glue and tape to our helmet, and we replaced all the padding to make the helmet wearable again. The hardware was powered with a 9V battery, and LEDs and a power switch were added to the helmet so the user could turn it on and off. The LEDs served as a visual indicator of whether or not the ESP32 had an internet connection.

## Challenges we ran into 💥
The first challenges came from created the exact schematic for the circuit. Once the schematic was drawn, bringing that to life took much play with different sized cables to ensure correct sensor positioning. 
The biggest challenge was getting all the sensors and components positioned in the correct locations such that the data will be read accurately.  On top of getting the correct positioning the wiring and all the components must be put in place in such a way that does not take away from the actually protective aspect of the helmet. Getting all the components hidden properly and securely was a great challenge and took hours of tinkering.  

## Accomplishments that we're proud of 🥂
We are incredibly proud of how we turned our vision into a reality. Our team successfully implemented key features such as user sessions and coach user management for seamless functionality. We also mapped out the circuits and integrated them into the helmet, enabling real-time SMS notifications for coaches. Additionally, we developed React components that visualize the collected data, making the system efficient and interactive. The hardware design was compact and elegant, seamlessly fitting into the helmet without compromising its structure. On the software side, the backend and frontend were designed to effectively store and serve data, ensuring the system's robustness.

## What we learned 🧠
Throughout this project, we learned a great deal about hardware integration, data visualization, and balancing safety with functionality. We also gained invaluable insights into optimizing the development process and managing complex technical challenges.

## What's next for Impactify 🔮
Moving forward, we aim to enhance the system by incorporating more sophisticated data analysis, providing even deeper insights into brain health aswell at fitting out hardware into a larger array of sports gear. We plan to expand the use of Impactify into more sports and further improve its ease of use for athletes and coaches alike. Additionally, we will explore ways to miniaturize the hardware even further to make the integration even more seamless.
