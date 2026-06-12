if (message.toLowerCase().includes("hello")) {
reply = "Hello! I'm Eagle AI.";
}
else if (message.toLowerCase().includes("how are you")) {
reply = "I'm doing great!";
}
else if (message.toLowerCase().includes("name")) {
reply = "My name is Eagle AI.";
}
else if (message.toLowerCase().includes("love")) {
reply = "Thank you! ❤️";
}
else if (message.toLowerCase().includes("bye")) {
reply = "Goodbye! See you later.";
}
else if (message.toLowerCase().includes("time")) {
reply = new Date().toLocaleTimeString();
}
else {
reply = "I don't understand yet.";
}