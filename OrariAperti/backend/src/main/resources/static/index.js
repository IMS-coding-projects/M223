document.querySelector('#footer-year').innerText = new Date().getFullYear();

let openModalButton = document.querySelector('#header-new-reservation');
let modalOverlay = document.querySelector('#modal-overlay');
let reservationModal = document.querySelector('#reservation-modal');
let closeModalButton = document.querySelector('#close-modal');
let reservationForm = document.querySelector('#reservation-form');
let reservationDateInput = document.querySelector('#reservation-date');
let reservationStartTimeInput = document.querySelector('#reservation-start-time');
let reservationEndTimeInput = document.querySelector('#reservation-end-time');
let reservationRoomInput = document.querySelector('#reservation-room');
let reservationDescriptionInput = document.querySelector('#reservation-description');
let reservationParticipantsInput = document.querySelector('#reservation-participants');
let privateKeyInput = document.querySelector('#private-key-input');
let publicKeyInput = document.querySelector('#public-key-input');
let keySubmit = document.querySelector('#key-submit');

const BASE_URL = '/api/reservation';

// Open modal
openModalButton.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    reservationModal.classList.remove('hidden');
});

// Close modal
closeModalButton.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

function closeModal() {
    flushFields()
    document.querySelector('#modal-title').innerText = 'New Reservation';
    flushFields()
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.innerText = "Create";
    modalOverlay.classList.add('hidden');
    reservationModal.classList.add('hidden');
}

// Handle form submission
reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure participants are separated by commas and remove invalid entries
    const participants = reservationParticipantsInput.value
        .split(',')
        .map(participant => participant.trim())
        .filter(participant => participant && participant !== ' ');
    reservationParticipantsInput.value = participants.join(', ');

    //make sure that start time is not after end time
    if (reservationStartTimeInput.value >= reservationEndTimeInput.value) {
        handleError(new Error("Invalid time range"), "Start time must be before end time.", false);
        return;
    }
    // make sure that the participants do not contain numbers or special characters
    if (!/^[A-Za-z\s]+(,\s*[A-Za-z\s]+)*$/.test(reservationParticipantsInput.value)) {
        handleError(new Error("Invalid participants"), "Participants must not contain any special characters or numbers.", false);
        return;
    }
    const reservation = {
        date: reservationDateInput.value,
        startTime: reservationStartTimeInput.value,
        endTime: reservationEndTimeInput.value,
        room: reservationRoomInput.value,
        description: reservationDescriptionInput.value,
        participants: reservationParticipantsInput.value
    };

    try {
        const postResponse = await fetch(BASE_URL, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(reservation)
        });

        if (!postResponse.ok) {
            handleError(new Error("Failed to create reservation"), "The selected room is already in use in the given time and date.", false);
            return;
        }

        const postData = await postResponse.json();
        privateKeyInput.value = postData.privateKey;
        publicKeyInput.value = postData.publicKey;
        notifyUser('Reservation created successfully!');
        flushFields();
        closeModal();
        showReservation();
    } catch (error) {
        console.error('Error creating reservation:', error);
    }
});


function handleError(err, msg, defaultTxt) {
    console.error(err);
    let element = document.createElement('div');
    if (element) {
        element.classList.add('errorArea');
        if (msg && defaultTxt) {
            element.innerHTML = 'Whoops we ran into an Error😿<br><span style="font-size: small">' + msg + '</span>';
        } else if (msg && !defaultTxt) {
            element.innerHTML = msg;
        } else {
            element.innerText = 'Whoops we ran into an Error😿. Try again later';
        }
        element.style.display = 'flex';
        element.style.flexDirection = 'column';
        element.style.alignItems = 'center';
        element.style.textAlign = 'center';
        element.innerHTML += '<br><div style="font-size: xx-small; text-align: center; width: 100%">Click Me :]</div>';

        document.body.appendChild(element);

        element.addEventListener('click', () => {
            element.classList.add('pushUp');
            setTimeout(() => {
                element.remove();
            }, 500);
        });

        setTimeout(() => {
            element.classList.add('pushUp');
            setTimeout(() => {
                element.remove();
            }, 500);
        }, 6500);

    } else {
        console.error('Failed to create error element');
    }
}

function notifyUser(msg) {
    let element = document.createElement('div');
    if (element) {
        element.classList.add('notificationArea');
        element.style.animation = 'dropDown 0.8s ease-out'; // Add the dropDown animation
        element.innerText = msg;
        element.style.display = 'flex';
        element.style.flexDirection = 'column';
        element.style.alignItems = 'center';
        element.innerHTML += '<br><div style="font-size: xx-small; text-align: center; width: 100%">Click Me</div>';

        document.body.appendChild(element);

        element.addEventListener('click', () => {
            element.classList.add('pushUp');
            element.style.animation = 'pushUp 0.8s ease-out'; // Add the pushUp animation
            setTimeout(() => {
                element.remove();
            }, 800);
        });

        setTimeout(() => {
            element.classList.add('pushUp');
            element.style.animation = 'pushUp 0.8s ease-out'; // Add the pushUp animation
            setTimeout(() => {
                element.remove();
            }, 800);
        }, 5500);

    } else {
        console.error('Failed to create notification element');
    }
}

function getURLParam(paramName) {
    const params = new URLSearchParams(window.location.search);
    if (params.get(paramName)) {
        return params.get(paramName);
    } else {
        return new Error("Requested parameter not found");
    }
}

// Clear all input fields
function flushFields() {
    reservationDateInput.value = '';
    reservationStartTimeInput.value = '';
    reservationEndTimeInput.value = '';
    reservationRoomInput.value = '';
    reservationDescriptionInput.value = '';
    reservationParticipantsInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {

    if (!(getURLParam('notify') instanceof Error)) {
        notifyUser(getURLParam('notify'));
        let url = new URL(window.location.href);
        url.searchParams.delete('notify');
        window.history.replaceState({}, document.title, url);
    }

    if (!(getURLParam('error') instanceof Error)) {
        handleError(new Error(getURLParam('error')), getURLParam('error'), false);
        let url = new URL(window.location.href);
        url.searchParams.delete('error');
        window.history.replaceState({}, document.title, url);
    }

    keySubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        await showReservation();
    });
});

async function showReservation() {
    let privateKey = privateKeyInput.value;
    let publicKey = publicKeyInput.value;

    if (privateKey || publicKey) {
        const headers = {
            "Content-Type": "application/json"
        };
        if (privateKey) {
            headers.privateKey = privateKey;
        } else if (publicKey) {
            headers.publicKey = publicKey;
        }

        try {
            let response = await fetch(BASE_URL, {
                method: "GET", headers: headers
            });

            if (!response.ok) {
                handleError(new Error("Failed to fetch reservation"), "Invalid key provided", false);
                return;
            }
            notifyUser('Successfully fetched reservation!');

            let data = await response.json();

            const reservationDetails = data.reservationDetails;
            if (reservationDetails) {
                const {id, date, startTime, endTime, room, description, participants} = reservationDetails;

                let buttons = '';
                if (privateKey) {
                    buttons = `
                        <button id="edit-reservation" data-reservation='${JSON.stringify(reservationDetails)}' class="btn btn-primary">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button id="delete-reservation" data-id="${id}" data-private-key="${privateKey}" class="btn btn-danger">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>                    
                    `;
                } 

                const reservationInfo = `
                    <div class="reservation-info">
                        <div class="reservation-details">
                            <h3><i class="fa-solid fa-calendar-days"></i> Reservation Details</h3>
                            <p><i class="fa-solid fa-calendar"></i> <strong>Date:</strong> ${date}</p>
                            <p><i class="fa-solid fa-clock"></i> <strong>Start Time:</strong> ${startTime}</p>
                            <p><i class="fa-solid fa-clock"></i> <strong>End Time:</strong> ${endTime}</p>
                            <p><i class="fa-solid fa-door-closed"></i> <strong>Room:</strong> ${room}</p>
                            <p><i class="fa-solid fa-align-left"></i> <strong>Description:</strong> ${description}</p>
                            <p><i class="fa-solid fa-users"></i> <strong>Participants:</strong> ${participants}</p>
                        </div>
                        <div class="reservation-buttons">
                            ${buttons}
                        </div>
                    </div>
                `;
                
                document.querySelector('#main-section').innerHTML = reservationInfo;
                try {
                    document.querySelector('#edit-reservation').addEventListener('click', (e) => {
                        openEditModal(JSON.parse(e.target.dataset.reservation));
                    });

                    document.querySelector('#delete-reservation').addEventListener('click', (e) => {
                        deleteReservation(e.target.dataset.id, e.target.dataset.privateKey);
                    });
                } catch (e) {
                    
                }
            } else {
                handleError(new Error("No reservation found"), "No reservation details available for the provided key.", false);
            }
        } catch (error) {
            handleError(error, "An error occurred while fetching the reservation.", false);
        }
    } else {
        handleError(new Error("No key provided"), "Please provide either a valid private or public key.", false);
    }
}

function deleteReservation(id, privateKey) {
    confirmAction("Are you sure you want to delete this reservation?", "Yes", "No").then(async (confirmed) => {
        if (confirmed) {
            try {
                const response = await fetch(`${BASE_URL}/${id}`, {
                    method: "DELETE", headers: {"Content-Type": "application/json", privateKey}
                });

                if (response.ok) {
                    notifyUser("Reservation deleted successfully!");
                    document.querySelector('#main-section').innerHTML = "<h2>Reservation Deleted Successfully</h2>";
                } else {
                    handleError(new Error("Failed to delete reservation"), "Could not delete the reservation.", false);
                }
            } catch (error) {
                handleError(error, "An error occurred while deleting the reservation.", false);
            }
        }
    });
}

function openEditModal(reservationDetails) {
    reservationForm.replaceWith(reservationForm.cloneNode(true));
    const {date, startTime, endTime, room, description, participants} = reservationDetails;
    reservationForm = document.querySelector('#reservation-form');
    reservationDateInput = document.querySelector('#reservation-date');
    reservationStartTimeInput = document.querySelector('#reservation-start-time');
    reservationEndTimeInput = document.querySelector('#reservation-end-time');
    reservationRoomInput = document.querySelector('#reservation-room');
    reservationDescriptionInput = document.querySelector('#reservation-description');
    reservationParticipantsInput = document.querySelector('#reservation-participants');

    // Populate modal fields with reservation details
    reservationDateInput.value = date;
    reservationStartTimeInput.value = startTime;
    reservationEndTimeInput.value = endTime;
    reservationRoomInput.value = room;
    reservationDescriptionInput.value = description;
    reservationParticipantsInput.value = participants;
    document.querySelector('#modal-title').innerText = 'Edit Reservation';

    // Change modal button to "Save"
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = "Save";
    submitButton.classList.add('btn-primary');

    // Open modal
    modalOverlay.classList.remove('hidden');
    reservationModal.classList.remove('hidden');
    // remove all possbile event listeners from the form

    // Update form submission logic
    document.querySelector('#reservation-form').onsubmit = async (e) => {
        e.preventDefault();

        const participants = reservationParticipantsInput.value
            .split(',')
            .map(participant => participant.trim())
            .filter(participant => participant && participant !== ' ');
        reservationParticipantsInput.value = participants.join(', ');

        //make sure that start time is not after end time
        if (reservationStartTimeInput.value >= reservationEndTimeInput.value) {
            handleError(new Error("Invalid time range"), "Start time must be before end time.", false);
            return;
        }

        // make sure that the participants does not contain numbers[a-zA-Z]
        if (!/^[A-Za-z\s]+(,\s*[A-Za-z\s]+)*$/.test(reservationParticipantsInput.value)) {
            handleError(new Error("Invalid participants"), "Participants must not contain numbers.", false);
            return;
        }

        const updatedReservation = {
            date: reservationDateInput.value,
            startTime: reservationStartTimeInput.value,
            endTime: reservationEndTimeInput.value,
            room: reservationRoomInput.value,
            description: reservationDescriptionInput.value,
            participants: reservationParticipantsInput.value
        };

        try {
            const response = await fetch(`${BASE_URL}/${reservationDetails.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json", privateKey: privateKeyInput.value},
                body: JSON.stringify(updatedReservation)
            });

            if (response.ok) {
                notifyUser("Reservation updated successfully!");
                closeModal();
                showReservation();
            } else {
                handleError(new Error("Failed to update reservation"), "Could not update the reservation.", false);
            }
        } catch (error) {
            handleError(error, "An error occurred while updating the reservation.", false);
        }
    };
}

let activeConfirmationResolve = null;

function confirmAction(msg, actionTrue, actionFalse) {
    // If there's an existing confirmation, resolve its promise with false
    if (activeConfirmationResolve) {
        activeConfirmationResolve(false);
        activeConfirmationResolve = null; // Clear the reference
    }

    // Check if there is already an outstanding confirmation in the DOM
    let existingConfirmation = document.querySelector('.confirmationArea');
    if (existingConfirmation) {
        existingConfirmation.classList.add('pushUp');
        existingConfirmation.style.animation = 'pushUp 0.8s ease-out';
        setTimeout(() => {
            existingConfirmation.remove();
        }, 800);
    }

    return new Promise((resolve) => {
        activeConfirmationResolve = resolve; // Store the current resolve function

        let element = document.createElement('div');
        if (element) {
            element.classList.add('confirmationArea');
            element.style.animation = 'dropDown 0.8s ease-out';
            element.innerHTML = "<strong>" + msg + "</strong>";
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
            element.style.alignItems = 'center';
            element.innerHTML += `
                <div style="width: 100%" class="flex-center">
                    <button id="actionTrue" style="background-color: #5cb85c;margin-top: 10px">${actionTrue}</button>
                    <button id="actionFalse" style="background-color: #d9534f;margin-top: 10px">${actionFalse}</button>
                </div>`;

            document.body.appendChild(element);

            document.querySelector('#actionTrue').addEventListener('click', () => {
                element.classList.add('pushUp');
                element.style.animation = 'pushUp 0.8s ease-out';
                setTimeout(() => {
                    element.remove();
                    resolve(true);
                    activeConfirmationResolve = null; // Clear the reference
                }, 800);
            });

            document.querySelector('#actionFalse').addEventListener('click', () => {
                element.classList.add('pushUp');
                element.style.animation = 'pushUp 0.8s ease-out';
                setTimeout(() => {
                    element.remove();
                    resolve(false);
                    activeConfirmationResolve = null; // Clear the reference
                }, 800);
            });
        }
    });
}