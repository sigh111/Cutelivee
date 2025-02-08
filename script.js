document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        sessionStorage.setItem("loggedUser", username);
        window.location.href = "./dashboard.html"; // Asegurar redirección válida
      } else {
        alert("❌ Usuario o contraseña incorrectos.");
      }
    })
    .catch(error => {
      console.error("Error de conexión:", error);
      alert("⚠️ No se pudo conectar con el servidor.");
    });
  } else {
    alert("❌ Por favor, ingresa usuario y contraseña.");
  }
});

document.getElementById("register-link").addEventListener("click", function() {
  alert("Regístrate aquí (implementación pendiente)");
});

document.getElementById("create-server").addEventListener("click", function() {
  alert("Crear servidor (implementación pendiente)");
});

document.getElementById("join-voice-channel").addEventListener("click", function() {
  alert("Unirse a llamada de voz (implementación pendiente)");
});

document.getElementById("send-message").addEventListener("click", function() {
  alert("Enviar mensaje de texto (implementación pendiente)");
});

// Agregar lógica para agregar amigos, crear roles, enviar mensajes de voz, etc.
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.querySelector(".auth-section").style.display = "none";
        document.getElementById("main-section").style.display = "block";
        document.getElementById("username-display").innerText = "Usuario: " + username;
      } else {
        alert("Credenciales incorrectas");
      }
    });
  }
});

// Función para crear servidores, enviar mensajes, y más...
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { authenticateUser } = require('./auth');
const { addUser, removeUser } = require('./db');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());

// Ruta de login
app.post('/api/login', authenticateUser);

// WebSocket para comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Manejar eventos de WebSocket, como mensajes, unirse a canales de voz, etc.
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar servidor
server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
// Simulación de autenticación (en un sistema real usarías una base de datos)
const users = [
  { username: 'usuario1', password: '1234' },
  { username: 'usuario2', password: '5678' },
];

function authenticateUser(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
 
// Simulación de autenticación (en un sistema real usarías una base de datos)
const users = [
  { username: 'usuario1', password: '1234' },
  { username: 'usuario2', password: '5678' },
];

function authenticateUser(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
}

module.exports = { authenticateUser };
let users = [
  { id: 1, username: 'usuario1', friends: [], servers: [] },
  { id: 2, username: 'usuario2', friends: [], servers: [] },
];

// Función para agregar amigo
function addFriend(userId, friendId) {
  const user = users.find(u => u.id === userId);
  const friend = users.find(u => u.id === friendId);

  if (user && friend && !user.friends.includes(friendId)) {
    user.friends.push(friendId);
    friend.friends.push(userId);
    return { success: true };
  } else {
    return { success: false, message: 'No se pudo agregar al amigo.' };
  }
}

// Función para crear servidor
function createServer(userId, serverName) {
  const user = users.find(u => u.id === userId);
  if (user) {
    const newServer = { name: serverName, owner: userId, members: [userId] };
    user.servers.push(newServer);
    return { success: true, server: newServer };
  } else {
    return { success: false, message: 'Usuario no encontrado.' };
  }
}

module.exports = { addFriend, createServer };
const { addFriend, createServer } = require('./db');

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado: ' + socket.id);

  // Escuchar eventos de amigos (agregar amigos)
  socket.on('add-friend', (userId, friendId) => {
    const result = addFriend(userId, friendId);
    if (result.success) {
      io.emit('friend-added', userId, friendId);
    } else {
      socket.emit('error', result.message);
    }
  });

  // Escuchar eventos de creación de servidor
  socket.on('create-server', (userId, serverName) => {
    const result = createServer(userId, serverName);
    if (result.success) {
      io.emit('server-created', result.server);
    } else {
      socket.emit('error', result.message);
    }
  });

  // Manejar la desconexión de usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado: ' + socket.id);
  });
});
let users = [
  { id: 1, username: 'usuario1', friends: [], servers: [], roles: [] },
  { id: 2, username: 'usuario2', friends: [], servers: [], roles: [] },
];

let servers = [
  { id: 1, name: 'Servidor 1', ownerId: 1, roles: [{ name: 'admin', permissions: ['manage_server', 'add_channel'] }], members: [1, 2] },
  { id: 2, name: 'Servidor 2', ownerId: 2, roles: [{ name: 'member', permissions: [] }], members: [2] },
];

// Crear un rol
function createRole(serverId, roleName, permissions) {
  const server = servers.find(s => s.id === serverId);
  if (server) {
    const newRole = { name: roleName, permissions: permissions };
    server.roles.push(newRole);
    return { success: true, role: newRole };
  }
  return { success: false, message: 'Servidor no encontrado.' };
}

// Asignar rol a un usuario
function assignRoleToUser(serverId, userId, roleName) {
  const server = servers.find(s => s.id === serverId);
  if (server) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.roles.push({ serverId: serverId, roleName: roleName });
      return { success: true };
    }
  }
  return { success: false, message: 'Error al asignar rol.' };
}

module.exports = { createRole, assignRoleToUser, users, servers };
let localStream;
let peerConnection;
const serverConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

document.getElementById("join-voice-channel").addEventListener("click", joinVoiceChannel);

function joinVoiceChannel() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      localStream = stream;
      document.getElementById('local-audio').srcObject = stream;
      initiateCall();
    })
    .catch(error => {
      console.error("Error al acceder al micrófono:", error);
    });
}

function initiateCall() {
  peerConnection = new RTCPeerConnection(serverConfig);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('send-ice-candidate', event.candidate);
    }
  };

  peerConnection.createOffer()
    .then(offer => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      socket.emit('send-offer', peerConnection.localDescription);
    });
}

socket.on('receive-offer', (offer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => peerConnection.createAnswer())
    .then(answer => peerConnection.setLocalDescription(answer))
    .then(() => {
      socket.emit('send-answer', peerConnection.localDescription);
    });
});

socket.on('receive-answer', (answer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('receive-ice-candidate', (candidate) => {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

document.getElementById("leave-call").addEventListener("click", leaveCall);

function leaveCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
}
// Crear servidor
function createServer(userId, serverName) {
  const user = users.find(u => u.id === userId);
  if (user) {
    const newServer = {
      id: servers.length + 1,
      name: serverName,
      ownerId: userId,
      roles: [{ name: 'admin', permissions: ['manage_server', 'add_channel'] }],
      members: [userId]
    };
    servers.push(newServer);
    return { success: true, server: newServer };
  }
  return { success: false, message: 'Usuario no encontrado.' };
}
document.getElementById("create-server-button").addEventListener("click", () => {
  const serverName = document.getElementById("server-name").value;
  if (serverName) {
    socket.emit('create-server', { userId: 1, serverName });
  }
});
document.getElementById("create-role-button").addEventListener("click", () => {
  const roleName = document.getElementById("role-name").value;
  const permissions = document.getElementById("permissions").value.split(',');
  socket.emit('create-role', { serverId: 1, roleName, permissions });
});
// Actualizar detalles del servidor
function updateServerDetails(serverId, newName, newImage, newBanner) {
  const server = servers.find(s => s.id === serverId);
  if (server) {
    server.name = newName || server.name;
    server.image = newImage || server.image;
    server.banner = newBanner || server.banner;
    return { success: true, server };
  }
  return { success: false, message: 'Servidor no encontrado.' };
}

module.exports = { addFriend, createServer, updateServerDetails, users, servers };
document.getElementById("update-server-button").addEventListener("click", () => {
  const newName = document.getElementById("new-server-name").value;
  const image = document.getElementById("new-server-image").files[0];
  const banner = document.getElementById("new-server-banner").files[0];

  const formData = new FormData();
  formData.append('name', newName);
  formData.append('image', image);
  formData.append('banner', banner);

  fetch('/update-server', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Servidor actualizado con éxito');
      } else {
        alert('Error: ' + data.message);
      }
    });
});
let messages = [
  { id: 1, userId: 1, serverId: 1, text: 'Hola!', type: 'text', timestamp: Date.now() },
  { id: 2, userId: 2, serverId: 1, text: '¡Hola!', type: 'text', timestamp: Date.now() },
];

function sendMessage(userId, serverId, messageText, messageType) {
  const message = {
    id: messages.length + 1,
    userId,
    serverId,
    text: messageText,
    type: messageType,
    timestamp: Date.now(),
  };
  messages.push(message);
  return message;
}

function deleteMessage(messageId) {
  const index = messages.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
    messages.splice(index, 1);
    return { success: true };
  }
  return { success: false, message: 'Mensaje no encontrado.' };
}

module.exports = { sendMessage, deleteMessage, users, servers, messages };
// Enviar mensaje
document.getElementById("send-message-button").addEventListener("click", () => {
  const messageText = document.getElementById("message-input").value;
  socket.emit('send-message', { userId: 1, serverId: 1, messageText, messageType: 'text' });
});

// Recibir y mostrar mensajes
socket.on('receive-message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message.text;
  document.getElementById('messages-list').appendChild(messageElement);
});

// Eliminar mensaje
function deleteMessage(messageId) {
  socket.emit('delete-message', messageId);
}
function updateUserProfile(userId, newProfilePic, newDescription) {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.profilePic = newProfilePic || user.profilePic;
    user.description = newDescription || user.description;
    return { success: true, user };
  }
  return { success: false, message: 'Usuario no encontrado.' };
}

module.exports = { updateUserProfile, users, servers };
document.getElementById("update-profile-button").addEventListener("click", () => {
  const profilePic = document.getElementById("profile-pic").files[0];
  const description = document.getElementById("profile-description").value;

  const formData = new FormData();
  formData.append('profilePic', profilePic);
  formData.append('description', description);

  fetch('/update-profile', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Perfil actualizado con éxito');
      } else {
        alert('Error: ' + data.message);
      }
    });
});
document.getElementById("create-bot-button").addEventListener("click", () => {
  const botName = document.getElementById("bot-name").value;
  const botDescription = document.getElementById("bot-description").value;
  
  socket.emit('create-bot', { serverId: 1, botName, botDescription });
});
let localStream;
let peerConnection;
let isMuted = false;
let isSharingScreen = false;

// Unirse a la llamada
document.getElementById("join-call-button").addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      localStream = stream;
      const callButton = document.getElementById("join-call-button");
      const muteButton = document.getElementById("toggle-mute-button");
      const shareButton = document.getElementById("share-screen-button");
      const leaveButton = document.getElementById("leave-call-button");

      callButton.disabled = true;
      muteButton.disabled = false;
      shareButton.disabled = false;
      leaveButton.disabled = false;

      // Configurar WebRTC PeerConnection aquí (más abajo)
      peerConnection = new RTCPeerConnection();
      peerConnection.addStream(localStream);

      // Lógica de manejo de llamadas
    })
    .catch(error => console.log('Error al acceder al micrófono: ', error));
});
document.getElementById("toggle-mute-button").addEventListener("click", () => {
  const track = localStream.getAudioTracks()[0];
  isMuted = !isMuted;
  track.enabled = !isMuted;
});
document.getElementById("share-screen-button").addEventListener("click", () => {
  if (!isSharingScreen) {
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(screenStream => {
        localStream.getTracks().forEach(track => track.stop());  // Detener el micrófono actual
        localStream = screenStream;
        peerConnection.addStream(screenStream);
        isSharingScreen = true;
      })
      .catch(error => console.log('Error al compartir pantalla: ', error));
  } else {
    // Detener compartir pantalla
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        localStream.getTracks().forEach(track => track.stop());  // Detener pantalla compartida
        localStream = stream;
        peerConnection.addStream(stream);
        isSharingScreen = false;
      })
      .catch(error => console.log('Error al detener compartir pantalla: ', error));
  }
});
document.getElementById("leave-call-button").addEventListener("click", () => {
  peerConnection.close();
  localStream.getTracks().forEach(track => track.stop());
  peerConnection = null;
  localStream = null;

  // Actualizar los botones
  document.getElementById("join-call-button").disabled = false;
  document.getElementById("toggle-mute-button").disabled = true;
  document.getElementById("share-screen-button").disabled = true;
  document.getElementById("leave-call-button").disabled = true;
});
let roles = [
  { id: 1, name: "Administrador", permissions: ["manage_channels", "ban_users", "add_roles"] },
  { id: 2, name: "Moderador", permissions: ["manage_channels"] },
  { id: 3, name: "Miembro", permissions: [] },
];

function addRoleToUser(userId, roleId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.roles.push(roleId);
    return { success: true, user };
  }
  return { success: false, message: 'Usuario no encontrado.' };
}

function createRole(name, permissions) {
  const newRole = {
    id: roles.length + 1,
    name,
    permissions
  };
  roles.push(newRole);
  return newRole;
}

module.exports = { roles, addRoleToUser, createRole };
document.getElementById("create-role-button").addEventListener("click", () => {
  const roleName = document.getElementById("role-name").value;
  const rolePermissions = document.getElementById("role-permissions").value.split(',');

  socket.emit('create-role', { roleName, rolePermissions });
});
document.getElementById("create-bot-button").addEventListener("click", () => {
  const botName = document.getElementById("bot-name").value;
  const botDescription = document.getElementById("bot-description").value;

  socket.emit('create-bot', { botName, botDescription });
});

// Recibir los bots creados
socket.on('bots-updated', (bots) => {
  const botList = document.getElementById('bot-list');
  botList.innerHTML = ''; // Limpiar lista antes de actualizar
  bots.forEach(bot => {
    const botItem = document.createElement('div');
    botItem.textContent = `${bot.name}: ${bot.description}`;
    botList.appendChild(botItem);
  });
});
// Guardar sesión del usuario
document.getElementById("login-button").addEventListener("click", () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  // Validación básica de usuario (esto debería ser mejorado con backend)
  if (username && password) {
    localStorage.setItem('username', username);
    // Redirigir a la interfaz principal después de iniciar sesión
    window.location.href = "/dashboard.html";
  } else {
    alert("Por favor, ingresa un nombre de usuario y contraseña válidos.");
  }
});
window.onload = () => {
  const username = localStorage.getItem('username');
  if (username) {
    // Si ya hay una sesión iniciada, redirigir al dashboard
    window.location.href = "/dashboard.html";
  }
};
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem('username');
  window.location.href = "/login.html"; // Redirigir a la página de login
});
document.getElementById("create-bot-button").addEventListener("click", () => {
  const botName = document.getElementById("bot-name").value;
  const botDescription = document.getElementById("bot-description").value;

  // Emitir evento para crear el bot
  socket.emit('create-bot', { botName, botDescription });
});

// Recibir y mostrar bots creados
socket.on('bots-updated', (bots) => {
  const botList = document.getElementById('bot-list');
  botList.innerHTML = ''; // Limpiar lista antes de actualizar
  bots.forEach(bot => {
    const botItem = document.createElement('div');
    botItem.textContent = `${bot.name}: ${bot.description}`;
    botList.appendChild(botItem);
  });
});
document.getElementById("create-voice-channel-button").addEventListener("click", () => {
  const channelName = prompt("Ingresa el nombre del canal de voz");
  
  if (channelName) {
    socket.emit('create-voice-channel', { channelName });
  }
});

// Recibir lista de canales y mostrarlos
socket.on('voice-channels-updated', (channels) => {
  const voiceChannelsList = document.getElementById('voice-channels-list');
  voiceChannelsList.innerHTML = '';
  channels.forEach(channel => {
    const channelItem = document.createElement('div');
    channelItem.textContent = channel.name;
    const joinButton = document.createElement('button');
    joinButton.textContent = "Unirse";
    joinButton.addEventListener('click', () => {
      socket.emit('join-voice-channel', { channelId: channel.id });
    });
    channelItem.appendChild(joinButton);
    voiceChannelsList.appendChild(channelItem);
  });
});
document.getElementById("toggle-microphone").addEventListener("click", () => {
  // Lógica para alternar el micrófono en WebRTC
  const isMuted = toggleMicrophone();
  const button = document.getElementById("toggle-microphone");
  button.textContent = isMuted ? "Activar micrófono" : "Silenciar micrófono";
});
document.getElementById("share-screen").addEventListener("click", () => {
  // Lógica para compartir pantalla usando WebRTC
  startScreenSharing();
});
document.getElementById("send-text-message").addEventListener("click", () => {
  const message = document.getElementById("text-message").value;
  const channelId = 'someChannelId'; // Este valor vendría del contexto del canal
  if (message) {
    socket.emit('send-text-message', { message, channelId });
    document.getElementById("text-message").value = ''; // Limpiar el campo
  }
});

// Recibir y mostrar mensajes de texto
socket.on('new-text-message', (message) => {
  const textChatArea = document.getElementById('text-chat-area');
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.username}: ${message.text}`;
  textChatArea.appendChild(messageElement);
});
document.querySelectorAll(".delete-message").forEach((button) => {
  button.addEventListener("click", () => {
    const messageId = button.dataset.messageId;
    socket.emit('delete-message', { messageId });
  });
});

// Escuchar eliminación de mensajes
socket.on('message-deleted', (messageId) => {
  const messageElement = document.querySelector(`.message[data-id="${messageId}"]`);
  if (messageElement) {
    messageElement.remove();
  }
});
document.querySelectorAll(".emoji-react").forEach((button) => {
  button.addEventListener("click", () => {
    const messageId = button.dataset.messageId;
    const emoji = button.textContent;
    socket.emit('add-emoji-reaction', { messageId, emoji });
  });
});
document.getElementById("update-server").addEventListener("click", () => {
  const newName = document.getElementById("server-name").value;
  const newImage = document.getElementById("server-image").files[0];
  const newBanner = document.getElementById("server-banner").value;
  
  socket.emit('update-server', { newName, newImage, newBanner });
});
document.getElementById("create-role").addEventListener("click", () => {
  const roleName = document.getElementById("role-name").value;
  const rolePermissions = document.getElementById("role-permissions").value;

  socket.emit('create-role', { roleName, rolePermissions });
});
function sendSticker(sticker) {
  socket.emit('send-sticker', { sticker });
}

// Mostrar sticker recibido en el chat
socket.on('receive-sticker', (data) => {
  const chatBox = document.getElementById("chat-box");
  const stickerImg = document.createElement("img");
  stickerImg.src = data.sticker;
  stickerImg.classList.add("sticker-in-chat");
  chatBox.appendChild(stickerImg);
});
document.getElementById("theme-selector").addEventListener("change", (e) => {
  const theme = e.target.value;
  switch (theme) {
    case "cute-pink":
      document.body.style.background = "linear-gradient(135deg, #ffb6c1, #ffe4e1)";
      break;
    case "pastel-blue":
      document.body.style.background = "linear-gradient(135deg, #a3d8ff, #e0f7ff)";
      break;
    case "soft-purple":
      document.body.style.background = "linear-gradient(135deg, #c8a2c8, #f2e0f7)";
      break;
    default:
      document.body.style.background = "linear-gradient(135deg, #ffb6c1, #ffe4e1)";
  }
});
document.getElementById("send-text-message").addEventListener("click", () => {
  document.getElementById("message-sound").play();
});

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("click-sound").play();
  });
});
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `rgba(255, 182, 193, ${Math.random()})`; // Rosa cute
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
const mascot = document.getElementById("cute-mascot");

mascot.addEventListener("click", () => {
  alert("¡Hola! Soy tu mascota virtual. 😊");
});
document.getElementById("avatar-selector").addEventListener("change", (e) => {
  document.getElementById("user-avatar").src = e.target.value;
});
const snowContainer = document.createElement("div");
snowContainer.id = "snow";
document.body.appendChild(snowContainer);

function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
  snowflake.innerHTML = "❄";
  snowContainer.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

setInterval(createSnowflake, 300);
const backgrounds = [
  "linear-gradient(135deg, #ffb6c1, #ffe4e1)",
  "linear-gradient(135deg, #a3d8ff, #e0f7ff)",
  "linear-gradient(135deg, #c8a2c8, #f2e0f7)",
  "linear-gradient(135deg, #fddbb0, #ffefd5)"
];

let currentBackground = 0;

function changeBackground() {
  currentBackground = (currentBackground + 1) % backgrounds.length;
  document.getElementById("dynamic-background").style.background = backgrounds[currentBackground];
}

setInterval(changeBackground, 5000);
function showNotification() {
  const bubble = document.getElementById("notification-bubble");
  bubble.classList.add("bubble-visible");

  setTimeout(() => {
    bubble.classList.remove("bubble-visible");
  }, 3000);
}

// Simulación de nuevo mensaje
setTimeout(showNotification, 2000);
const themeToggle = document.getElementById("theme-toggle");
let isDark = false;

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme", isDark);
  document.body.classList.toggle("light-theme", !isDark);
  isDark = !isDark;
});
let score = 0;
document.getElementById("click-game").addEventListener("click", () => {
  score++;
  document.getElementById("click-score").innerText = "Puntos: " + score;
});
const clickSound = document.getElementById("click-sound");
const messageSound = document.getElementById("message-sound");

document.querySelectorAll(".glow-button").forEach((button) => {
  button.addEventListener("click", () => clickSound.play());
});

// Simulación de mensaje recibido
setTimeout(() => messageSound.play(), 5000);
document.querySelectorAll(".sticker").forEach((sticker) => {
  sticker.addEventListener("click", () => {
    const chat = document.getElementById("chat");
    const img = document.createElement("img");
    img.src = sticker.src;
    img.classList.add("chat-sticker");
    chat.appendChild(img);
  });
});
const avatar = document.getElementById("user-avatar");

document.getElementById("message-input").addEventListener("focus", () => {
  avatar.src = "thinking.png";
});

document.getElementById("message-input").addEventListener("blur", () => {
  avatar.src = "happy.png";
});
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

function drawConfetti() {
  for (let i = 0; i < 100; i++) {
    confettiCtx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
    confettiCtx.fillRect(Math.random() * confettiCanvas.width, Math.random() * confettiCanvas.height, 10, 10);
  }
}

document.getElementById("join-server").addEventListener("click", () => {
  drawConfetti();
  setTimeout(() => confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height), 3000);
});
const pet = document.getElementById("cute-pet");

pet.addEventListener("click", () => {
  pet.src = "pet-excited.png";
  setTimeout(() => {
    pet.src = "pet-happy.png";
  }, 2000);
});

document.getElementById("send-message").addEventListener("click", () => {
  pet.src = "pet-talking.png";
  setTimeout(() => {
    pet.src = "pet-happy.png";
  }, 2000);
});
document.getElementById("chat-background-selector").addEventListener("change", (e) => {
  document.getElementById("chat-container").style.background = `url(${e.target.value})`;
});
setTimeout(() => {
  document.getElementById("floating-chat").classList.add("active");
}, 3000);
function showMentionAlert() {
  const alert = document.getElementById("mention-alert");
  alert.style.opacity = "1";
  alert.style.transform = "translateY(0)";
  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transform = "translateY(-10px)";
  }, 3000);
}
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 5 + 2,
    speedX: Math.random() * 2 - 1,
    speedY: Math.random() * 2 - 1,
    color: `hsl(${Math.random() * 360}, 100%, 75%)`
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();
const clickSound = document.getElementById("click-sound");
const messageSound = document.getElementById("message-sound");

document.querySelectorAll(".glow-button").forEach(button => {
  button.addEventListener("click", () => {
    clickSound.play();
  });
});

function playMessageSound() {
  messageSound.play();
}
window.onload = function () {
  const popup = document.getElementById("welcome-popup");
  popup.classList.add("active");

  document.getElementById("close-popup").addEventListener("click", () => {
    popup.classList.remove("active");
  });
};
const backgrounds = [
  "pink-clouds.jpg",
  "starry-night.jpg",
  "pastel-gradient.jpg"
];

let currentIndex = 0;

setInterval(() => {
  currentIndex = (currentIndex + 1) % backgrounds.length;
  document.getElementById("background-container").style.backgroundImage = `url(${backgrounds[currentIndex]})`;
}, 10000);
const heartCanvas = document.getElementById("heart-particles");
const heartCtx = heartCanvas.getContext("2d");
heartCanvas.width = window.innerWidth;
heartCanvas.height = window.innerHeight;

let hearts = [];

function createHeart() {
  hearts.push({
    x: Math.random() * heartCanvas.width,
    y: heartCanvas.height + 10,
    size: Math.random() * 20 + 5,
    speed: Math.random() * 2 + 1,
    color: `hsl(${Math.random() * 360}, 100%, 75%)`
  });
}

function animateHearts() {
  heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  hearts.forEach((h, i) => {
    h.y -= h.speed;
    heartCtx.fillStyle = h.color;
    heartCtx.beginPath();
    heartCtx.arc(h.x, h.y, h.size, 0, Math.PI * 2);
    heartCtx.fill();
    if (h.y < -10) hearts.splice(i, 1);
  });
  requestAnimationFrame(animateHearts);
}

setInterval(createHeart, 500);
animateHearts();
function toggleStickerGallery() {
  document.getElementById("sticker-gallery").classList.toggle("hidden");
}

function sendSticker(stickerSrc) {
  const chat = document.getElementById("chat-messages");
  const stickerElement = document.createElement("img");
  stickerElement.src = stickerSrc;
  stickerElement.classList.add("sent-sticker");
  chat.appendChild(stickerElement);
}
document.getElementById("kawaii-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("kawaii-mode");
});
const starCanvas = document.getElementById("star-canvas");
const starCtx = starCanvas.getContext("2d");
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

let stars = [];

document.addEventListener("click", (event) => {
  stars.push({
    x: event.clientX,
    y: event.clientY,
    size: Math.random() * 5 + 2,
    opacity: 1,
  });
});

function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach((star, i) => {
    starCtx.globalAlpha = star.opacity;
    starCtx.fillStyle = "gold";
    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starCtx.fill();
    star.opacity -= 0.02;
    if (star.opacity <= 0) stars.splice(i, 1);
  });
  requestAnimationFrame(animateStars);
}

animateStars();
document.getElementById("party-mode").addEventListener("click", () => {
  document.body.classList.toggle("party");
  const music = document.getElementById("party-music");
  music.paused ? music.play() : music.pause();
});
function subscribeNitro() {
  localStorage.setItem("nitroCute", "true");
  alert("🎉 ¡Felicidades! Ahora tienes Nitro Cute. 🎀");
  applyNitroBenefits();
}

function applyNitroBenefits() {
  if (localStorage.getItem("nitroCute") === "true") {
    document.body.classList.add("nitro-active");
  }
}

window.onload = applyNitroBenefits;
if (localStorage.getItem("nitroCute") === "true") {
  peerConnection.audioBitrate = 256; // Mayor calidad de audio
}
function addReaction(messageId, emoji) {
  const message = document.getElementById(messageId);
  const reaction = document.createElement("span");
  reaction.textContent = emoji;
  reaction.classList.add("nitro-reaction");
  message.appendChild(reaction);
}
function joinVoiceCall() {
  const callWindow = document.createElement("div");
  callWindow.classList.add("voice-call", "nitro-active");
  callWindow.textContent = "🎙️ En llamada";
  document.body.appendChild(callWindow);
}
function inviteKawaiiBot() {
  localStorage.setItem("kawaiiBot", "added");
  document.getElementById("bot-status").innerText = "Estado: Añadido ✅";
  alert("🎉 ¡KawaiiBot ha sido añadido a tu servidor!");
}

function checkBotStatus() {
  if (localStorage.getItem("kawaiiBot") === "added") {
    document.getElementById("bot-status").innerText = "Estado: Añadido ✅";
  }
}

window.onload = checkBotStatus;
const kawaiiResponses = {
  "!hug": ["💖 *KawaiiBot te da un abrazo grande* 🤗", "💞 *¡Aquí tienes un abrazo virtual!* 🤗"],
  "!kiss": ["😘 *KawaiiBot te manda un beso tierno!*", "💋 *Besito de KawaiiBot para ti!*"],
  "!fortune": ["🔮 *Tu futuro es brillante!* ✨", "🌟 *Grandes cosas vienen para ti.*"],
  "!joke": ["😂 *¿Por qué el tomate se sonrojó? Porque vio la ensalada desnuda!*", "🤣 *¿Qué hace una abeja en el gimnasio? ¡Zum-ba!*"]
};

function sendKawaiiCommand(command) {
  if (kawaiiResponses[command]) {
    const response = kawaiiResponses[command][Math.floor(Math.random() * kawaiiResponses[command].length)];
    alert(response);
  } else {
    alert("❌ Comando no reconocido.");
  }
}
function playGuessNumber() {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  let userGuess = prompt("🎲 Adivina un número del 1 al 10:");
  if (parseInt(userGuess) === randomNumber) {
    alert("🎉 ¡Felicidades! Adivinaste el número correcto.");
  } else {
    alert("❌ ¡Incorrecto! El número era " + randomNumber);
  }
}
function checkNitroCommand(command) {
  if (localStorage.getItem("nitroCute") !== "true") {
    alert("🚫 Este comando es exclusivo para usuarios Nitro Cute.");
    return;
  }

  if (command === "!specialGift") {
    alert("🎁 ¡Has recibido un regalo exclusivo de KawaiiBot!");
  }
}
// Verifica si el usuario ya tiene monedas guardadas
if (!localStorage.getItem("kawaiiCoins")) {
  localStorage.setItem("kawaiiCoins", JSON.stringify({}));
}

// Función para obtener las monedas del usuario
function getCoins(user) {
  let coins = JSON.parse(localStorage.getItem("kawaiiCoins"));
  return coins[user] || 0;
}

// Función para añadir monedas
function addCoins(user, amount) {
  let coins = JSON.parse(localStorage.getItem("kawaiiCoins"));
  coins[user] = (coins[user] || 0) + amount;
  localStorage.setItem("kawaiiCoins", JSON.stringify(coins));
}

// Función para mostrar el saldo
function checkCoins(user) {
  alert(`💰 ${user} tiene ${getCoins(user)} KawaiiCoins.`);
}
const gachaPrizes = ["🎀 Sticker raro", "✨ Fondo exclusivo", "🐱 Emoji especial", "💎 50 KawaiiCoins"];

function playGacha(user) {
  if (getCoins(user) < 10) {
    alert("❌ No tienes suficientes KawaiiCoins. Necesitas 10.");
    return;
  }
  addCoins(user, -10); // Resta 10 monedas
  let prize = gachaPrizes[Math.floor(Math.random() * gachaPrizes.length)];
  alert(`🎉 ¡Ganaste: ${prize}!`);
}
if (!localStorage.getItem("userXP")) {
  localStorage.setItem("userXP", JSON.stringify({}));
}

function getXP(user) {
  let xpData = JSON.parse(localStorage.getItem("userXP"));
  return xpData[user] || 0;
}

function addXP(user, amount) {
  let xpData = JSON.parse(localStorage.getItem("userXP"));
  xpData[user] = (xpData[user] || 0) + amount;
  localStorage.setItem("userXP", JSON.stringify(xpData));
}

function checkLevel(user) {
  let xp = getXP(user);
  let level = Math.floor(xp / 100) + 1;
  alert(`🌟 ${user} está en el nivel ${level} con ${xp} XP.`);
}
if (!localStorage.getItem("botPrefix")) {
  localStorage.setItem("botPrefix", "!");
}

function changeBotPrefix(newPrefix) {
  localStorage.setItem("botPrefix", newPrefix);
  alert(`✅ Prefijo de KawaiiBot cambiado a: ${newPrefix}`);
}
