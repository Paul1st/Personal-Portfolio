// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        alert('All fields are required!');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    const formData = {
        name: name,
        email: email,
        message: message
    };

    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent successfully!');
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while sending the message.');
    });
});

function createProjectItem(project) {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.innerHTML = `
        <img src="https://via.placeholder.com/300" alt="${project.name}">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <a href="${project.html_url}" target="_blank">View on GitHub</a>
    `;
    return projectItem;
}

function fetchGitHubRepos() {
    const username = 'Paul1st';
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(repos => {
            const projectGallery = document.getElementById('project-gallery');
            projectGallery.innerHTML = '';
            if (repos.length === 0) {
                projectGallery.innerHTML = '<p>No repositories found.</p>';
            } else {
                repos.forEach(repo => {
                    const projectItem = createProjectItem(repo);
                    projectGallery.appendChild(projectItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching GitHub repos:', error);
            const projectGallery = document.getElementById('project-gallery');
            projectGallery.innerHTML = '<p>Error fetching repositories. Please try again later.</p>';
        });
}

document.addEventListener('DOMContentLoaded', fetchGitHubRepos);

function fetchMessages() {
    fetch('/api/messages')
        .then(response => response.json())
        .then(messages => {
            const messageList = document.getElementById('message-list');
            messageList.innerHTML = '';
            if (messages.length === 0) {
                messageList.innerHTML = '<p>No messages found.</p>';
            } else {
                messages.forEach(message => {
                    const messageItem = document.createElement('div');
                    messageItem.classList.add('message-item');
                    messageItem.innerHTML = `
                        <h4>${message.name}</h4>
                        <p>${message.email}</p>
                        <p>${message.message}</p>
                        <small>${new Date(message.created_at).toLocaleString()}</small>
                    `;
                    messageList.appendChild(messageItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            const messageList = document.getElementById('message-list');
            messageList.innerHTML = '<p>Error fetching messages. Please try again later.</p>';
        });
}

document.addEventListener('DOMContentLoaded', fetchMessages);
