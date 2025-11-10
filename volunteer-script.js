// Volunteer Dashboard Script
const OBSERVATION_KEY = 'volunteerObservations';
const FOLLOWUP_KEY = 'volunteerFollowUps';
const HISTORY_KEY = 'volunteerHistoryLogs';
let volunteerProfile = null;
let volunteerIdentifier = 'Volunteer';
let activeFollowupId = null;

function activateTab(target) {
    if (!target) return;
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let matched = false;

    tabButtons.forEach(btn => {
        const isMatch = btn.dataset.target === target;
        btn.classList.toggle('active', isMatch);
        if (isMatch) matched = true;
    });

    tabContents.forEach(section => {
        const isMatch = section.getAttribute('data-tab') === target;
        section.classList.toggle('active', isMatch);
        if (isMatch) {
            matched = true;
        }
    });

    if (!matched && tabButtons.length) {
        const fallback = tabButtons[0].dataset.target;
        activateTab(fallback);
        return;
    }

    const activeSection = document.querySelector(`.tab-content[data-tab="${target}"]`);
    if (activeSection) {
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function bindTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabTriggers = document.querySelectorAll('.tab-trigger');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => activateTab(btn.dataset.target));
    });

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => activateTab(trigger.dataset.target));
    });

    const defaultTarget = document.querySelector('.tab-btn.active')?.dataset.target || 'dashboard';
    activateTab(defaultTarget);
}

const UPCOMING_ASSIGNMENTS = [
    {
        title: 'Tai Chi Support Session',
        datetime: 'Nov 25 • 09:00',
        location: 'Victoria Park Pavilion',
        role: 'Observing',
        status: 'upcoming'
    },
    {
        title: 'Harbour Stroll Check-in',
        datetime: 'Nov 27 • 11:30',
        location: 'Tsim Sha Tsui Promenade',
        role: 'Attending',
        status: 'upcoming'
    },
    {
        title: 'Evening Wellness Calls',
        datetime: 'Dec 02 • 18:30',
        location: 'Virtual',
        role: 'Follow-up',
        status: 'follow-up'
    }
];

const EVENTS_SCHEDULE = [
    {
        title: 'Tai Chi Support Session',
        date: 'November 25, 2025',
        time: '09:00',
        location: 'Victoria Park Pavilion',
        role: 'Observing',
        status: 'Upcoming'
    },
    {
        title: 'Harbour Stroll Check-in',
        date: 'November 27, 2025',
        time: '11:30',
        location: 'Tsim Sha Tsui Promenade',
        role: 'Attending',
        status: 'Upcoming'
    },
    {
        title: 'Community Story Circle',
        date: 'November 18, 2025',
        time: '14:00',
        location: 'Central Library Lounge',
        role: 'Facilitating',
        status: 'Completed'
    }
];

const ENCOURAGEMENT_MESSAGES = [
    'You are cherished, and your presence brightens our community.',
    'Every step you take is a reminder that resilience lives within you.',
    'Thank you for sharing your stories—your wisdom inspires us all.',
    'Take a deep breath; we’re walking alongside you, every moment.',
    'Your kindness today created ripples of joy for others.'
];

const RATING_DESCRIPTIONS = {
    1: '1 • Critical support needed',
    2: '2 • Struggling, please intervene',
    3: '3 • Balanced',
    4: '4 • Positive and connected',
    5: '5 • Thriving and energised'
};

const MOOD_ALERTS = new Set(['Anxious', 'Distressed']);

function loadVolunteerProfile() {
    const savedProfile = localStorage.getItem('elderConnectProfile');
    if (!savedProfile) {
        window.location.href = 'index.html';
        return;
    }
    try {
        volunteerProfile = JSON.parse(savedProfile);
        if (!volunteerProfile || volunteerProfile.userType !== 'volunteer') {
            window.location.href = 'elder-connect-simple.html';
            return;
        }
        volunteerIdentifier = volunteerProfile.preferredName || 'Volunteer';
        const displayName = document.getElementById('volunteer-name-display');
        if (displayName) {
            displayName.textContent = volunteerIdentifier;
        }
        const welcomeName = document.getElementById('volunteer-welcome-name');
        if (welcomeName) {
            welcomeName.textContent = volunteerIdentifier;
        }
    } catch (error) {
        console.error('Unable to load volunteer profile:', error);
        window.location.href = 'index.html';
    }
}

function readStore(key) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Unable to load data for key', key, error);
        return [];
    }
}

function writeStore(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getObservations() {
    return readStore(OBSERVATION_KEY).filter(entry => entry.volunteerId === volunteerIdentifier);
}

function getFollowups() {
    return readStore(FOLLOWUP_KEY).filter(entry => entry.volunteerId === volunteerIdentifier);
}

function saveObservation(entry) {
    const all = readStore(OBSERVATION_KEY).filter(o => o.volunteerId !== volunteerIdentifier);
    all.push(entry);
    writeStore(OBSERVATION_KEY, all);
}

function saveFollowups(followups) {
    const others = readStore(FOLLOWUP_KEY).filter(f => f.volunteerId !== volunteerIdentifier);
    writeStore(FOLLOWUP_KEY, others.concat(followups));
}

function appendFollowup(followup) {
    const all = readStore(FOLLOWUP_KEY);
    all.push(followup);
    writeStore(FOLLOWUP_KEY, all);
}

function getHistoryLogs() {
    return readStore(HISTORY_KEY).filter(entry => entry.volunteerId === volunteerIdentifier);
}

function appendHistoryLog(entry) {
    const all = readStore(HISTORY_KEY);
    all.push(entry);
    writeStore(HISTORY_KEY, all);
}

function clearVolunteerData() {
    const obs = readStore(OBSERVATION_KEY).filter(o => o.volunteerId !== volunteerIdentifier);
    const followups = readStore(FOLLOWUP_KEY).filter(f => f.volunteerId !== volunteerIdentifier);
    const history = readStore(HISTORY_KEY).filter(log => log.volunteerId !== volunteerIdentifier);
    writeStore(OBSERVATION_KEY, obs);
    writeStore(FOLLOWUP_KEY, followups);
    writeStore(HISTORY_KEY, history);
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function renderObservationLog() {
    const container = document.getElementById('logs-container');
    if (!container) return;

    const observationEntries = getObservations().map(obs => ({
        timestamp: obs.timestamp,
        title: `${obs.elderName} • ${obs.eventName || 'Event feedback'}`,
        summary: [
            obs.mood ? `Mood: ${obs.mood}` : null,
            Number.isFinite(obs.rating) ? `Rating: ${obs.rating}/5` : null
        ].filter(Boolean).join(' · '),
        details: obs.notes || ''
    }));

    const historyEntries = getHistoryLogs().map(log => ({
        timestamp: log.timestamp,
        title: log.title || `${log.elderName || 'Participant'} • ${log.eventName || 'Update'}`,
        summary: log.summary || '',
        details: log.details || ''
    }));

    const combined = [...observationEntries, ...historyEntries]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 12);

    container.innerHTML = '';

    if (combined.length === 0) {
        container.innerHTML = '<p class="empty">No logs yet. Capture a wellbeing update above.</p>';
        return;
    }

    combined.forEach(entry => {
        const node = document.createElement('div');
        node.className = 'log-entry';
        node.innerHTML = `
            <h4>${entry.title}</h4>
            ${entry.summary ? `<p>${entry.summary}</p>` : ''}
            ${entry.details ? `<p>${entry.details}</p>` : ''}
            <time>${formatTime(entry.timestamp)}</time>
        `;
        container.appendChild(node);
    });
}

function renderFollowupQueue() {
    const queue = document.getElementById('followup-queue');
    const emptyState = document.getElementById('followup-empty');
    if (!queue || !emptyState) return;

    const followups = getFollowups().filter(f => f.status !== 'completed').sort((a, b) => a.status === 'pending' ? -1 : 1);

    queue.innerHTML = '';
    emptyState.style.display = followups.length === 0 ? 'block' : 'none';

    const overviewFollowups = document.getElementById('overview-followups-count');
    if (overviewFollowups) {
        overviewFollowups.textContent = followups.length.toString();
    }

    const insightFollowups = document.getElementById('insight-followups');
    if (insightFollowups) {
        insightFollowups.textContent = followups.length.toString();
    }

    const alertsBadge = document.getElementById('alerts-open-count');
    if (alertsBadge) {
        if (followups.length === 0) {
            alertsBadge.textContent = 'All clear';
            alertsBadge.classList.remove('critical');
            alertsBadge.classList.add('success');
        } else {
            alertsBadge.textContent = `${followups.length} action${followups.length === 1 ? '' : 's'}`;
            alertsBadge.classList.add('critical');
            alertsBadge.classList.remove('success');
        }
    }

    followups.forEach(followup => {
        const card = document.createElement('div');
        card.className = 'followup-card';
        card.dataset.followupId = followup.id;

        const tag = followup.assignedTo === 'AI' ? '<span class="tag ai">AI chatbot</span>' : '<span class="tag volunteer">Volunteer</span>';
        card.innerHTML = `
            <div class="followup-meta">
                <h4>${followup.elderName} • ${followup.eventName}</h4>
                <p>Mood: ${followup.mood} · Rating: ${followup.rating}/5</p>
                ${tag}
            </div>
            <div class="followup-actions">
                ${followup.assignedTo === 'AI' ? '<button data-action="open">Open in AI assistant</button>' : ''}
                <button data-action="resolve" class="secondary">Mark resolved</button>
            </div>
        `;

        queue.appendChild(card);
    });
}

function populateFollowupSelect() {
    const select = document.getElementById('followup-select');
    if (!select) return;

    const aiFollowups = getFollowups().filter(f => f.assignedTo === 'AI' && f.status !== 'completed');
    const current = select.value;

    select.innerHTML = '<option value="">Pending AI follow-ups will appear here</option>';

    aiFollowups.forEach(followup => {
        const option = document.createElement('option');
        option.value = followup.id;
        option.textContent = `${followup.elderName} • ${followup.eventName}`;
        select.appendChild(option);
    });

    if (current && aiFollowups.some(f => f.id === current)) {
        select.value = current;
        activeFollowupId = current;
        showFollowupDetails(current);
    } else {
        activeFollowupId = '';
        clearFollowupDetails();
    }
}

function clearFollowupDetails() {
    const details = document.getElementById('followup-details');
    const suggestion = document.getElementById('ai-suggestion');
    const message = document.getElementById('ai-message');
    const log = document.getElementById('ai-log');
    const generateBtn = document.getElementById('generate-suggestion');
    const sendBtn = document.getElementById('ai-send');
    const completeBtn = document.getElementById('ai-mark-complete');

    if (details) {
        details.classList.add('empty');
        details.innerHTML = 'Choose a participant to review their recent observation and suggested response.';
    }
    if (suggestion) suggestion.textContent = 'AI suggestions will appear here.';
    if (message) message.value = '';
    if (log) log.innerHTML = '';
    if (generateBtn) generateBtn.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    if (completeBtn) completeBtn.disabled = true;
}

function showFollowupDetails(followupId) {
    const followup = getFollowups().find(f => f.id === followupId);
    if (!followup) {
        clearFollowupDetails();
        return;
    }
    activeFollowupId = followupId;

    const details = document.getElementById('followup-details');
    const logContainer = document.getElementById('ai-log');
    const generateBtn = document.getElementById('generate-suggestion');
    const sendBtn = document.getElementById('ai-send');
    const completeBtn = document.getElementById('ai-mark-complete');

    if (details) {
        details.classList.remove('empty');
        details.innerHTML = `
            <p><strong>Participant:</strong> ${followup.elderName}</p>
            <p><strong>Event:</strong> ${followup.eventName}</p>
            <p><strong>Mood:</strong> ${followup.mood} &nbsp;|&nbsp; <strong>Rating:</strong> ${followup.rating}/5</p>
            <p><strong>Observation notes:</strong> ${followup.notes || '—'}</p>
        `;
    }

    if (logContainer) {
        logContainer.innerHTML = '';
        (followup.aiMessages || []).slice().reverse().forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'ai-log-entry';
            logEntry.innerHTML = `<strong>${entry.sender}</strong>: ${entry.message}<br><small>${formatTime(entry.timestamp)}</small>`;
            logContainer.appendChild(logEntry);
        });
    }

    if (generateBtn) generateBtn.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    if (completeBtn) completeBtn.disabled = false;
}

function generateAISuggestion() {
    if (!activeFollowupId) return;
    const followup = getFollowups().find(f => f.id === activeFollowupId);
    if (!followup) return;

    const suggestionField = document.getElementById('ai-suggestion');
    if (!suggestionField) return;

    const templates = {
        Distressed: 'Hi ${name}, I noticed the last session felt heavy. I’m here to listen—would you like to share what would feel comforting right now?',
        Anxious: 'Hi ${name}, I sensed some worries after the event. Together we can take one gentle step at a time. Would a breathing exercise or a friendly call help today?',
        Quiet: 'Hello ${name}, thank you for joining us. I’m checking in to see how you’re feeling and if there’s anything we can do to make the next session feel easier.',
        default: 'Hello ${name}, we appreciate your presence. If anything felt overwhelming, I’m here to offer support and companionship.'
    };

    const template = templates[followup.mood] || templates.default;
    const message = template.replace('${name}', followup.elderName);
    suggestionField.textContent = message;

    const messageBox = document.getElementById('ai-message');
    if (messageBox && !messageBox.value.trim()) {
        messageBox.value = message;
    }
}

function appendAIMsg(followup, sender, message) {
    if (!followup.aiMessages) followup.aiMessages = [];
    followup.aiMessages.push({ sender, message, timestamp: Date.now() });
}

function updateFollowup(followupId, updater) {
    const all = readStore(FOLLOWUP_KEY);
    const index = all.findIndex(f => f.id === followupId && f.volunteerId === volunteerIdentifier);
    if (index === -1) return;
    const updated = { ...all[index] };
    updater(updated);
    all[index] = updated;
    writeStore(FOLLOWUP_KEY, all);
}

function sendAIMessage() {
    if (!activeFollowupId) return;
    const messageField = document.getElementById('ai-message');
    if (!messageField) return;

    const text = messageField.value.trim();
    if (!text) {
        alert('Compose a message before sending.');
        messageField.focus();
        return;
    }

    updateFollowup(activeFollowupId, followup => {
        appendAIMsg(followup, 'AI Companion', text);
        if (followup.status === 'pending') {
            followup.status = 'ai-contacted';
        }
        followup.updatedAt = Date.now();
    });

    messageField.value = '';
    showFollowupDetails(activeFollowupId);
    renderFollowupQueue();
    updateImpactStats();
    alert('Support message recorded. The participant will receive your encouragement.');
}

function completeFollowup(followupId) {
    updateFollowup(followupId, followup => {
        followup.status = 'completed';
        followup.completedAt = Date.now();
        appendAIMsg(followup, 'Volunteer', 'Follow-up marked as resolved.');
    });

    if (activeFollowupId === followupId) {
        activeFollowupId = null;
        clearFollowupDetails();
    }
    renderFollowupQueue();
    populateFollowupSelect();
    updateImpactStats();
}

function createObservation(formData) {
    const rating = Number(formData.get('rating'));
    const mood = formData.get('mood');
    const needsAI = rating <= 2 || MOOD_ALERTS.has(mood);
    const wantsVolunteerFollowUp = formData.get('volunteerFollowUp') === 'on';

    const observation = {
        id: `obs-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        volunteerId: volunteerIdentifier,
        elderName: formData.get('elderName').trim(),
        eventName: formData.get('eventName').trim(),
        mood,
        rating,
        notes: formData.get('notes').trim(),
        timestamp: Date.now()
    };

    saveObservation(observation);

    if (needsAI) {
        appendFollowup({
            id: `followup-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            observationId: observation.id,
            volunteerId: volunteerIdentifier,
            elderName: observation.elderName,
            eventName: observation.eventName,
            mood: observation.mood,
            rating: observation.rating,
            notes: observation.notes,
            assignedTo: 'AI',
            status: 'pending',
            aiMessages: [],
            createdAt: Date.now()
        });
    }

    if (wantsVolunteerFollowUp && !needsAI) {
        appendFollowup({
            id: `followup-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            observationId: observation.id,
            volunteerId: volunteerIdentifier,
            elderName: observation.elderName,
            eventName: observation.eventName,
            mood: observation.mood,
            rating: observation.rating,
            notes: observation.notes,
            assignedTo: 'Volunteer',
            status: 'pending',
            createdAt: Date.now()
        });
    }
}

function updateImpactStats() {
    const observations = getObservations();
    const followups = getFollowups();

    const overviewFeedback = document.getElementById('overview-feedback-count');
    if (overviewFeedback) {
        overviewFeedback.textContent = observations.length.toString();
    }

    const overviewFollowups = document.getElementById('overview-followups-count');
    if (overviewFollowups) {
        const pendingFollowups = followups.filter(f => f.status !== 'completed').length;
        overviewFollowups.textContent = pendingFollowups.toString();
    }

    const insightLogCount = document.getElementById('insight-log-count');
    if (insightLogCount) {
        insightLogCount.textContent = observations.length.toString();
    }

    const insightAiCount = document.getElementById('insight-ai-count');
    if (insightAiCount) {
        insightAiCount.textContent = followups.filter(f => f.assignedTo === 'AI').length.toString();
    }

    const statObservations = document.getElementById('stat-observations');
    const statAI = document.getElementById('stat-ai');
    const statCompleted = document.getElementById('stat-completed');
    const statProfile = document.getElementById('stat-profile');

    if (statObservations) statObservations.textContent = observations.length.toString();
    if (statAI) statAI.textContent = followups.filter(f => f.assignedTo === 'AI').length.toString();
    if (statCompleted) statCompleted.textContent = followups.filter(f => f.status === 'completed').length.toString();
    if (statProfile) statProfile.textContent = followups.filter(f => f.assignedTo === 'AI').length.toString();
}

function bindFeedbackForms() {
    const ratingForm = document.getElementById('rating-form');
    if (ratingForm) {
        ratingForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(ratingForm);
            const elderName = formData.get('elderName')?.trim();
            const eventName = formData.get('eventName')?.trim();
            const rating = formData.get('rating');
            const mood = formData.get('mood');
            if (!elderName || !eventName || !rating || !mood) {
                alert('Please complete all required fields before saving this rating.');
                return;
            }
            createObservation(formData);
            ratingForm.reset();
            renderObservationLog();
            renderFollowupQueue();
            populateFollowupSelect();
            updateImpactStats();
            alert('Engagement rating saved. Thank you!');
        });
    }

    const checkinForm = document.getElementById('checkin-form');
    if (checkinForm) {
        checkinForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(checkinForm);
            const elderName = formData.get('elderName')?.trim();
            const eventName = formData.get('eventName')?.trim();
            const energy = formData.get('energy');
            const concern = formData.get('concern');
            const notes = formData.get('notes')?.trim() || '';
            if (!elderName || !eventName || !energy || !concern) {
                alert('Please complete the wellbeing information before saving.');
                return;
            }

            appendHistoryLog({
                volunteerId: volunteerIdentifier,
                title: `${elderName} • Wellbeing check`,
                summary: `Energy: ${energy} · Concern: ${concern}`,
                details: notes,
                timestamp: Date.now()
            });

            const needsFollowUp = concern === 'Needs immediate follow-up' || concern === 'Requests wellness resources';
            if (needsFollowUp) {
                appendFollowup({
                    id: `followup-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    volunteerId: volunteerIdentifier,
                    observationId: null,
                    elderName,
                    eventName,
                    mood: concern,
                    rating: 3,
                    notes,
                    assignedTo: 'Volunteer',
                    status: 'pending',
                    createdAt: Date.now()
                });
            }

            checkinForm.reset();
            renderObservationLog();
            renderFollowupQueue();
            populateFollowupSelect();
            updateImpactStats();
            alert('Wellbeing check recorded. Thank you for the update.');
        });
    }

    const supportForm = document.getElementById('support-form');
    const messageField = document.getElementById('support-message');
    if (supportForm && messageField) {
        const suggestionButtons = document.querySelectorAll('.chip[data-suggestion]');
        suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const suggestion = button.getAttribute('data-suggestion');
                if (!suggestion) return;
                if (messageField.value.trim()) {
                    messageField.value = `${messageField.value.trim()} ${suggestion}`;
                } else {
                    messageField.value = suggestion;
                }
                messageField.focus();
            });
        });

        supportForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(supportForm);
            const elderName = formData.get('elderName')?.trim();
            const message = formData.get('message')?.trim();
            if (!elderName || !message) {
                alert('Please include the participant’s name and your message.');
                return;
            }

            appendHistoryLog({
                volunteerId: volunteerIdentifier,
                title: `${elderName} • Encouragement sent`,
                summary: 'Encouragement shared',
                details: message,
                timestamp: Date.now()
            });

            supportForm.reset();
            renderObservationLog();
            alert('Encouragement sent! Keep uplifting our seniors.');
        });

        const encouragementText = document.getElementById('encouragement-text');
        const encouragementBtn = document.getElementById('generate-encouragement');
        if (encouragementBtn && encouragementText) {
            encouragementBtn.addEventListener('click', () => {
                const message = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
                encouragementText.textContent = message;
                if (!messageField.value.trim()) {
                    messageField.value = message;
                }
            });
        }
    }

    const clearLogsBtn = document.getElementById('clear-logs');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            const confirmClear = confirm('Remove all logged observations and follow-ups for your volunteer account?');
            if (!confirmClear) return;
            clearVolunteerData();
            renderObservationLog();
            renderFollowupQueue();
            populateFollowupSelect();
            clearFollowupDetails();
            updateImpactStats();
        });
    }
}

function bindFollowupQueueActions() {
    const queue = document.getElementById('followup-queue');
    if (!queue) return;

    queue.addEventListener('click', event => {
        const action = event.target.getAttribute('data-action');
        if (!action) return;
        const card = event.target.closest('.followup-card');
        if (!card) return;
        const followupId = card.dataset.followupId;
        if (!followupId) return;

        if (action === 'open') {
            const select = document.getElementById('followup-select');
            if (select) {
                select.value = followupId;
            }
            showFollowupDetails(followupId);
        }

        if (action === 'resolve') {
            completeFollowup(followupId);
        }
    });
}

function bindAISupportPanel() {
    const select = document.getElementById('followup-select');
    const generateBtn = document.getElementById('generate-suggestion');
    const sendBtn = document.getElementById('ai-send');
    const completeBtn = document.getElementById('ai-mark-complete');

    if (select) {
        select.addEventListener('change', () => {
            if (select.value) {
                showFollowupDetails(select.value);
            } else {
                clearFollowupDetails();
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', generateAISuggestion);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendAIMessage);
    }

    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            if (!activeFollowupId) {
                alert('Select a participant before marking as resolved.');
                return;
            }
            completeFollowup(activeFollowupId);
        });
    }

    const downloadBtn = document.getElementById('download-summary');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const observations = getObservations();
            const followups = getFollowups();
            const lines = [
                'ElderConnect Volunteer Summary',
                `Volunteer: ${volunteerIdentifier}`,
                `Generated: ${new Date().toLocaleString()}`,
                '',
                'Observations:',
                ...observations.map(o => `- ${o.elderName} • ${o.eventName} • Mood: ${o.mood} • Rating: ${o.rating}/5`),
                '',
                'Follow-ups:',
                ...followups.map(f => `- ${f.elderName} • ${f.eventName} • Assigned to: ${f.assignedTo} • Status: ${f.status}`)
            ];
            const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'elderconnect-volunteer-summary.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }
}

function bindQuickActions() {
    const eventsBtn = document.getElementById('open-events');
    if (eventsBtn) {
        eventsBtn.addEventListener('click', () => {
            window.location.href = 'elder-connect-simple.html#events';
        });
    }

    const coordinatorBtn = document.getElementById('contact-coordinator');
    if (coordinatorBtn) {
        coordinatorBtn.addEventListener('click', () => {
            alert('Coordinator chat will launch soon. Meanwhile, email support@elderconnect.com for assistance.');
        });
    }

    const accountBtn = document.getElementById('open-account');
    if (accountBtn) {
        accountBtn.addEventListener('click', () => {
            window.location.href = 'elder-connect-simple.html#account';
        });
    }

    const logoutBtn = document.getElementById('volunteer-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const confirmLogout = confirm('Sign out of the volunteer wellbeing center?');
            if (confirmLogout) {
                window.location.href = 'index.html';
            }
        });
    }
}

function renderEventsTable() {
    const tbody = document.getElementById('events-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!EVENTS_SCHEDULE.length) {
        const row = document.createElement('tr');
        row.className = 'empty';
        row.innerHTML = '<td colspan="4">No scheduled events yet.</td>';
        tbody.appendChild(row);
        return;
    }

    EVENTS_SCHEDULE.forEach(event => {
        const row = document.createElement('tr');
        const statusClass = event.status.toLowerCase().includes('complete') ? 'completed' : (event.status.toLowerCase().includes('follow') ? 'followup' : 'upcoming');
        row.innerHTML = `
            <td>
                <span class="event-title">${event.title}</span>
                <span class="event-location">${event.location}</span>
            </td>
            <td>${event.date}<br><span class="event-time">${event.time}</span></td>
            <td>${event.role}</td>
            <td><span class="status-badge ${statusClass}">${event.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function renderUpcomingEvents() {
    const list = document.getElementById('upcoming-events-list');
    if (list) {
        list.innerHTML = '';

        if (!UPCOMING_ASSIGNMENTS.length) {
            list.innerHTML = '<li class="empty">No upcoming events assigned yet.</li>';
        } else {
            UPCOMING_ASSIGNMENTS.slice(0, 4).forEach(item => {
                const li = document.createElement('li');
                if (item.status === 'follow-up') {
                    li.classList.add('needs-attention');
                }
                li.innerHTML = `
                    <div class="item-title">${item.title}</div>
                    <div class="item-meta">${item.datetime} · ${item.location}</div>
                    <span class="role-tag">${item.role}</span>
                `;
                list.appendChild(li);
            });
        }
    }

    const upcomingCount = UPCOMING_ASSIGNMENTS.filter(event => event.status === 'upcoming').length;

    const eventsTag = document.getElementById('events-count-tag');
    if (eventsTag) {
        if (upcomingCount > 0) {
            eventsTag.textContent = `${upcomingCount} upcoming`;
            eventsTag.classList.remove('neutral');
            eventsTag.classList.add('info');
        } else {
            eventsTag.textContent = 'No upcoming events';
            eventsTag.classList.remove('info');
            eventsTag.classList.add('neutral');
        }
    }

    const overviewEvents = document.getElementById('overview-events-count');
    if (overviewEvents) {
        overviewEvents.textContent = upcomingCount.toString();
    }

    const nextEvent = UPCOMING_ASSIGNMENTS.find(event => event.status === 'upcoming') || UPCOMING_ASSIGNMENTS[0];
    const nextEventSpan = document.getElementById('insight-next-event');
    if (nextEventSpan) {
        if (nextEvent) {
            nextEventSpan.textContent = `${nextEvent.title} • ${nextEvent.datetime}`;
        } else {
            nextEventSpan.textContent = 'No events scheduled';
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadVolunteerProfile();
    bindTabNavigation();
    renderUpcomingEvents();
    renderEventsTable();
    bindFeedbackForms();
    bindFollowupQueueActions();
    bindAISupportPanel();
    bindQuickActions();
    renderObservationLog();
    renderFollowupQueue();
    populateFollowupSelect();
    updateImpactStats();
});
