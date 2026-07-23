import { deleteCharacterChatByName } from '../../../../script.js';

const EXTENSION_NAME = 'MistraelSL Character Chat Pills';
const PANEL_CLASS = 'character-chat-pills';
const MAX_RECENT_CHATS = 1000;
const RECENT_CACHE_TTL = 60 * 1000;
const PINNED_CHARACTERS_KEY = 'MistraelSL_CharacterChatPills_pinnedCharacters';
const FAVORITE_CHATS_KEY = 'MistraelSL_CharacterChatPills_favoriteChats';
const MOBILE_COLUMNS_KEY = 'MistraelSL_CharacterChatPills_mobileColumns';

const I18N = {
    en: {
        charactersWithChats: 'Characters with chats', characterChats: 'Character chats',
        chatLibrary: 'CHAT LIBRARY', chooseCharacter: 'Choose a character',
        characterCount: '{count} characters with conversations', portraitShelf: 'Portrait shelf',
        compactGrid: 'Compact grid', findCharacter: 'Find a character...', recent: 'Recent',
        active: 'Active', frequent: 'Frequent', noCharacters: 'No characters match this view.',
        unnamedCharacter: 'Unnamed character', character: 'Character', chatsCount: '{count} chats',
        conversations: 'CONVERSATIONS', loadingHistory: 'Loading chat history...',
        lastActiveSummary: '{count} chats · last active {date}', newChat: 'New chat',
        searchChats: 'Search this character’s chats...', loadingChats: 'Loading chats...',
        noChats: 'No chats with this character yet.', loadChatsFailed: 'Could not load this character’s chats.',
        loadChatsFailedShort: 'Could not load chats', backToCharacters: 'Back to characters',
        loadingCharacters: 'Loading characters...', returnFailed: 'Could not return to the character browser.',
        loadCharactersFailed: 'Could not load character chats. Reload SillyTavern and try again.',
        unnamedChat: 'Unnamed chat', noPreview: 'No message preview', messages: '{count} messages',
        renameChat: 'Rename chat', deleteChat: 'Delete chat', lastUsed: 'Last used',
        lastUsedTitle: 'The chat where the most recent message was written for this character',
        nameNewChat: 'Name your new chat', enterChatName: 'Enter a chat name:',
        deleteQuestion: 'Delete chat?', deleteConfirm: 'Delete “{name}”? This cannot be undone.',
        chatRenamed: 'Chat renamed', chatDeleted: 'Chat deleted', unavailable: 'Character is no longer available',
        openerUnavailable: 'SillyTavern chat opener is unavailable', newChatNameMissing: 'The new chat was created, but its file name was not found',
        renameRejected: 'SillyTavern rejected the new chat name', requestFailed: 'Request failed ({status})',
        recentFailed: 'Recent chats request failed ({status})', historyFailed: 'Chat history request failed ({status})',
        csrfFailed: 'CSRF request failed ({status})', back: 'Back', findChat: 'Find a chat...',
        chatsWith: 'Chats with {name}',
        closeChat: 'Close chat',
        pinCharacter: 'Pin character', unpinCharacter: 'Unpin character',
        favoriteChat: 'Favorite chat', unfavoriteChat: 'Remove from favorites',
        undoDelete: 'Undo delete', deletedUndoHint: 'Chat deleted. Click to undo.',
        chatRestored: 'Chat restored', restoreFailed: 'Could not restore chat',
        mobileColumns: 'Characters per row',
        unknownDate: 'Date unknown',
    },
    ru: {
        charactersWithChats: 'Персонажи с чатами', characterChats: 'Чаты персонажа',
        chatLibrary: 'БИБЛИОТЕКА ЧАТОВ', chooseCharacter: 'Выберите персонажа',
        characterCount: 'Персонажей с чатами: {count}', portraitShelf: 'Портретная сетка',
        compactGrid: 'Компактная сетка', findCharacter: 'Найти персонажа...', recent: 'Недавние',
        active: 'Активные', frequent: 'Частые', noCharacters: 'В этом разделе ничего не найдено.',
        unnamedCharacter: 'Безымянный персонаж', character: 'Персонаж', chatsCount: 'Чатов: {count}',
        conversations: 'ЧАТЫ', loadingHistory: 'Загрузка истории чатов...',
        lastActiveSummary: 'Чатов: {count} · последняя активность {date}', newChat: 'Новый чат',
        searchChats: 'Поиск по чатам персонажа...', loadingChats: 'Загрузка чатов...',
        noChats: 'У этого персонажа пока нет чатов.', loadChatsFailed: 'Не удалось загрузить чаты этого персонажа.',
        loadChatsFailedShort: 'Не удалось загрузить чаты', backToCharacters: 'Назад к персонажам',
        loadingCharacters: 'Загрузка персонажей...', returnFailed: 'Не удалось вернуться к списку персонажей.',
        loadCharactersFailed: 'Не удалось загрузить чаты. Перезагрузите SillyTavern и попробуйте снова.',
        unnamedChat: 'Безымянный чат', noPreview: 'Нет превью сообщения', messages: 'Сообщений: {count}',
        renameChat: 'Переименовать чат', deleteChat: 'Удалить чат', lastUsed: 'Последний использованный',
        lastUsedTitle: 'Чат, в котором последним было написано сообщение у этого персонажа',
        nameNewChat: 'Назовите новый чат', enterChatName: 'Введите название чата:',
        deleteQuestion: 'Удалить чат?', deleteConfirm: 'Удалить «{name}»? Это действие нельзя отменить.',
        chatRenamed: 'Чат переименован', chatDeleted: 'Чат удалён', unavailable: 'Персонаж больше недоступен',
        openerUnavailable: 'Функция открытия чата SillyTavern недоступна', newChatNameMissing: 'Чат создан, но не удалось определить имя его файла',
        renameRejected: 'SillyTavern не принял новое название чата', requestFailed: 'Ошибка запроса ({status})',
        recentFailed: 'Не удалось загрузить недавние чаты ({status})', historyFailed: 'Не удалось загрузить историю чатов ({status})',
        csrfFailed: 'Не удалось получить CSRF-токен ({status})', back: 'Назад', findChat: 'Найти чат...',
        chatsWith: 'Чаты с персонажем {name}',
        closeChat: 'Закрыть чат',
        pinCharacter: 'Закрепить персонажа', unpinCharacter: 'Открепить персонажа',
        favoriteChat: 'Добавить чат в избранное', unfavoriteChat: 'Убрать чат из избранного',
        undoDelete: 'Отменить удаление', deletedUndoHint: 'Чат удалён. Нажмите, чтобы отменить.',
        chatRestored: 'Чат восстановлен', restoreFailed: 'Не удалось восстановить чат',
        mobileColumns: 'Персонажей в строке',
        unknownDate: 'Дата неизвестна',
    },
};

function getLanguage() {
    const context = globalThis.SillyTavern?.getContext?.();
    const tavernLanguages = [
        document.documentElement.lang,
        context?.getCurrentLocale?.(),
        context?.locale,
        context?.language,
    ];

    for (const value of tavernLanguages) {
        const language = String(value || '').trim().toLowerCase();
        if (language.startsWith('ru')) return 'ru';
        if (language.startsWith('en')) return 'en';
    }

    return String(navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

function t(key, values = {}) {
    let text = I18N[getLanguage()]?.[key] ?? I18N.en[key] ?? key;
    for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
}

let renderGeneration = 0;
let csrfToken = null;
let recentChatsCache = null;
let recentChatsCachedAt = 0;

function loadStringSet(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return new Set(Array.isArray(value) ? value : []);
    } catch {
        return new Set();
    }
}

function saveStringSet(key, value) {
    localStorage.setItem(key, JSON.stringify([...value]));
}

const pinnedCharacters = loadStringSet(PINNED_CHARACTERS_KEY);
const favoriteChats = loadStringSet(FAVORITE_CHATS_KEY);

function getChatKey(avatar, fileName) {
    return `${avatar}::${String(fileName || '').toLocaleLowerCase()}`;
}

function isFavoriteChat(entry, chat) {
    return favoriteChats.has(getChatKey(entry.avatar, chat.file_name));
}

function sortCharacterChats(entry, chats) {
    markLastActiveChat(chats);
    chats.sort((a, b) => {
        const favoriteDifference = Number(isFavoriteChat(entry, b)) - Number(isFavoriteChat(entry, a));
        return favoriteDifference || getChatTimestamp(b) - getChatTimestamp(a);
    });
}

async function getCsrfToken() {
    if (csrfToken) return csrfToken;

    const response = await fetch('/csrf-token', { cache: 'no-cache' });
    if (!response.ok) throw new Error(t('csrfFailed', { status: response.status }));

    const data = await response.json();
    csrfToken = data.token;
    return csrfToken;
}

async function getRecentChats(force = false) {
    if (!force && recentChatsCache && Date.now() - recentChatsCachedAt < RECENT_CACHE_TTL) {
        return recentChatsCache;
    }

    const token = await getCsrfToken();
    const response = await fetch('/api/chats/recent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
        },
        body: JSON.stringify({ max: MAX_RECENT_CHATS, pinned: [] }),
        cache: 'no-cache',
    });

    if (!response.ok) throw new Error(t('recentFailed', { status: response.status }));
    const chats = await response.json();
    recentChatsCache = Array.isArray(chats) ? chats : [];
    recentChatsCachedAt = Date.now();
    return recentChatsCache;
}

function toTimestamp(value) {
    if (value instanceof Date) {
        const timestamp = value.getTime();
        return Number.isFinite(timestamp) ? timestamp : 0;
    }

    if (typeof value === 'number') {
        if (!Number.isFinite(value) || value <= 0) return 0;
        return value < 1e12 ? value * 1000 : value;
    }

    const raw = String(value ?? '').trim();
    if (!raw) return 0;

    if (/^\d+(?:\.\d+)?$/.test(raw)) {
        const numeric = Number(raw);
        if (Number.isFinite(numeric) && numeric > 0) {
            return numeric < 1e12 ? numeric * 1000 : numeric;
        }
    }

    const timestamp = Date.parse(raw);
    return Number.isFinite(timestamp) ? timestamp : 0;
}

function getChatTimestamp(chat, character = null) {
    const candidates = [
        chat?.last_mes,
        chat?.updated_at,
        chat?.updatedAt,
        chat?.mtime,
        chat?.date,
        character?.date_last_chat,
    ];

    for (const value of candidates) {
        const timestamp = toTimestamp(value);
        if (timestamp) return timestamp;
    }

    return 0;
}

function groupChatsByCharacter(chats, characters) {
    const charactersByAvatar = new Map(characters.map(character => [character.avatar, character]));
    const grouped = new Map();

    for (const chat of chats) {
        if (!chat.avatar || chat.group) continue;

        const character = charactersByAvatar.get(chat.avatar);
        if (!character) continue;

        let entry = grouped.get(chat.avatar);
        if (!entry) {
            entry = {
                avatar: chat.avatar,
                character,
                chats: [],
                latestTimestamp: 0,
                latestChat: '',
                latestMessage: '',
            };
            grouped.set(chat.avatar, entry);
        }

        entry.chats.push(chat);
        const timestamp = getChatTimestamp(chat, character);
        if (timestamp >= entry.latestTimestamp) {
            entry.latestTimestamp = timestamp;
            entry.latestChat = String(chat.file_name || '').replace(/\.jsonl$/i, '');
            entry.latestMessage = chat.mes || '';
        }
    }

    return [...grouped.values()].sort((a, b) => b.latestTimestamp - a.latestTimestamp);
}

function makeAvatarUrl(avatar) {
    return `/thumbnail?type=avatar&file=${encodeURIComponent(avatar)}`;
}

const dateFormatters = new Map();

function formatDate(timestamp) {
    const normalized = toTimestamp(timestamp);
    if (!normalized) return t('unknownDate');

    const language = getLanguage();
    if (!dateFormatters.has(language)) {
        dateFormatters.set(language, new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }));
    }

    try {
        return dateFormatters.get(language).format(new Date(normalized));
    } catch {
        return t('unknownDate');
    }
}

function markLastActiveChat(chats) {
    let latest = null;
    let latestTimestamp = -1;

    for (const chat of chats) {
        chat.isLastActive = false;
        const timestamp = getChatTimestamp(chat);
        if (timestamp > latestTimestamp) {
            latestTimestamp = timestamp;
            latest = chat;
        }
    }

    if (latest) latest.isLastActive = true;
}

function createCharacterPill(entry) {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'character-chat-pill';
    pill.dataset.search = (entry.character.name || '').toLocaleLowerCase();

    const avatar = document.createElement('img');
    avatar.className = 'character-chat-pill-avatar';
    avatar.src = makeAvatarUrl(entry.avatar);
    avatar.alt = entry.character.name || t('character');
    avatar.loading = 'lazy';
    avatar.decoding = 'async';

    const name = document.createElement('strong');
    name.className = 'character-chat-pill-name';
    name.textContent = entry.character.name || t('unnamedCharacter');

    const count = document.createElement('span');
    count.className = 'character-chat-pill-count';
    count.textContent = `${entry.chats.length}`;
    count.title = t('chatsCount', { count: entry.chats.length });

    const pin = document.createElement('span');
    pin.className = 'character-chat-pill-pin';
    pin.setAttribute('role', 'button');
    pin.setAttribute('tabindex', '0');
    pin.classList.toggle('is-pinned', pinnedCharacters.has(entry.avatar));
    pin.innerHTML = '<i class="fa-solid fa-thumbtack"></i>';
    const updatePinLabel = () => {
        const label = pinnedCharacters.has(entry.avatar) ? t('unpinCharacter') : t('pinCharacter');
        pin.title = label;
        pin.setAttribute('aria-label', label);
    };
    const togglePin = event => {
        event.preventDefault();
        event.stopPropagation();
        pinnedCharacters.has(entry.avatar) ? pinnedCharacters.delete(entry.avatar) : pinnedCharacters.add(entry.avatar);
        saveStringSet(PINNED_CHARACTERS_KEY, pinnedCharacters);
        const browser = pill.closest('.character-chat-browser');
        browser?._refreshCharacters?.();
    };
    pin.addEventListener('click', togglePin);
    pin.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') togglePin(event);
    });
    updatePinLabel();

    const date = document.createElement('span');
    date.className = 'character-chat-pill-date';
    date.textContent = formatDate(entry.latestTimestamp);

    const caption = document.createElement('span');
    caption.className = 'character-chat-pill-caption';
    caption.append(name, date);

    pill.append(avatar, caption, count, pin);
    pill.addEventListener('click', () => openCharacterChats(entry));
    return pill;
}

async function fetchCharacterChats(avatar) {
    const token = await getCsrfToken();
    const response = await fetch('/api/characters/chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
        },
        body: JSON.stringify({ avatar_url: avatar }),
        cache: 'no-cache',
    });

    if (!response.ok) throw new Error(t('historyFailed', { status: response.status }));
    const chats = await response.json();
    return Array.isArray(chats) ? chats : [];
}

async function requestJson(path, body) {
    const token = await getCsrfToken();
    const response = await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
        },
        body: JSON.stringify(body),
        cache: 'no-cache',
    });

    if (!response.ok) throw new Error(t('requestFailed', { status: response.status }));
    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? response.json() : {};
}

async function askForName(title, currentValue = '') {
    const context = SillyTavern?.getContext?.();
    if (context?.Popup?.show?.input) {
        const result = await context.Popup.show.input(title, t('enterChatName'), currentValue);
        return result === false || result == null ? null : String(result).trim();
    }

    const result = window.prompt(title, currentValue);
    return result == null ? null : result.trim();
}

async function confirmAction(title, message) {
    const context = SillyTavern?.getContext?.();
    if (context?.Popup?.show?.confirm) {
        return Boolean(await context.Popup.show.confirm(title, message));
    }
    return window.confirm(message);
}

async function renameChatFile(entry, chat, requestedName) {
    const oldFile = String(chat.file_name || '');
    const oldName = oldFile.replace(/\.jsonl$/i, '');
    const newName = String(requestedName || '').trim().replace(/\.jsonl$/i, '');
    if (!newName || newName === oldName) return null;

    const result = await requestJson('/api/chats/rename', {
        avatar_url: entry.avatar,
        original_file: oldFile,
        renamed_file: `${newName}.jsonl`,
        is_group: false,
    });

    if (result.error) throw new Error(t('renameRejected'));
    const finalName = result.sanitizedFileName || newName;
    chat.file_name = `${finalName}.jsonl`;
    recentChatsCache = null;
    return finalName;
}

async function renameChat(entry, chat, row) {
    const oldName = String(chat.file_name || '').replace(/\.jsonl$/i, '');
    const newName = await askForName(t('renameChat'), oldName);
    if (!newName || newName === oldName) return;

    try {
        const oldFavoriteKey = getChatKey(entry.avatar, chat.file_name);
        const wasFavorite = favoriteChats.has(oldFavoriteKey);
        const finalName = await renameChatFile(entry, chat, newName);
        if (!finalName) return;
        if (wasFavorite) {
            favoriteChats.delete(oldFavoriteKey);
            favoriteChats.add(getChatKey(entry.avatar, chat.file_name));
            saveStringSet(FAVORITE_CHATS_KEY, favoriteChats);
        }
        const name = row.querySelector('.character-chat-modal-row-name');
        if (name) name.textContent = finalName;
        if (typeof toastr !== 'undefined') toastr.success(t('chatRenamed'), EXTENSION_NAME);
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to rename chat`, error);
        if (typeof toastr !== 'undefined') toastr.error(error.message, EXTENSION_NAME);
    }
}

async function deleteChat(entry, chat, row) {
    const chatName = String(chat.file_name || '').replace(/\.jsonl$/i, '');
    const confirmed = await confirmAction(t('deleteQuestion'), t('deleteConfirm', { name: chatName }));
    if (!confirmed) return;

    try {
        const fileName = String(chat.file_name || '').replace(/\.jsonl$/i, '');
        const backup = await requestJson('/api/chats/get', {
            avatar_url: entry.avatar,
            file_name: fileName,
        });

        const context = SillyTavern?.getContext?.();
        const characterId = (context?.characters || []).findIndex(character => character.avatar === entry.avatar);
        if (characterId < 0) throw new Error(t('unavailable'));

        // Use SillyTavern's native deletion path. Besides removing the file, it
        // updates the character's active-chat pointer and in-memory state. A
        // direct endpoint call left an open deleted chat in memory, so ST saved
        // it again during reload and made it appear to return.
        await deleteCharacterChatByName(String(characterId), fileName);

        const remainingChats = await fetchCharacterChats(entry.avatar);
        if (remainingChats.some(item => String(item.file_name || '').replace(/\.jsonl$/i, '') === fileName)) {
            throw new Error(t('requestFailed', { status: 'delete' }));
        }

        recentChatsCache = null;
        favoriteChats.delete(getChatKey(entry.avatar, chat.file_name));
        saveStringSet(FAVORITE_CHATS_KEY, favoriteChats);
        const root = row.closest('.character-chat-detail, .character-chat-modal');
        await refreshVisibleChatList(entry, root);

        if (typeof toastr !== 'undefined') {
            toastr.info(t('deletedUndoHint'), t('undoDelete'), {
                timeOut: 12000,
                extendedTimeOut: 12000,
                closeButton: true,
                onclick: async () => {
                    try {
                        await requestJson('/api/chats/save', {
                            avatar_url: entry.avatar,
                            file_name: fileName,
                            chat: backup,
                            force: true,
                        });
                        recentChatsCache = null;
                        await refreshVisibleChatList(entry, root);
                        toastr.success(t('chatRestored'), EXTENSION_NAME);
                    } catch (error) {
                        console.error(`${EXTENSION_NAME}: failed to restore chat`, error);
                        toastr.error(t('restoreFailed'), EXTENSION_NAME);
                    }
                },
            });
        }
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to delete chat`, error);
        if (typeof toastr !== 'undefined') toastr.error(error.message, EXTENSION_NAME);
    }
}

async function refreshVisibleChatList(entry, root) {
    if (!root?.isConnected) return;
    const list = root.querySelector('.character-chat-detail-list, .character-chat-modal-list');
    if (!list) return;

    const chats = await fetchCharacterChats(entry.avatar);
    sortCharacterChats(entry, chats);
    list.replaceChildren(...chats.map(chat => {
        const row = createChatRow(entry, chat);
        if (list.classList.contains('character-chat-detail-list')) row.classList.add('character-chat-detail-row');
        return row;
    }));
    if (!chats.length) showEmptyState(list, t('noChats'));
    updateVisibleChatCount(root);
}

function updateVisibleChatCount(root) {
    if (!root) return;
    const count = root.querySelectorAll('.character-chat-modal-row').length;
    const summary = root.querySelector('[data-chat-count]');
    if (summary) summary.textContent = t('chatsCount', { count });
}

async function createNamedChat(entry) {
    const requestedName = await askForName(t('nameNewChat'));
    if (!requestedName) return;

    try {
        const context = SillyTavern?.getContext?.();
        const characters = context?.characters || [];
        const characterId = characters.findIndex(character => character.avatar === entry.avatar);
        if (characterId < 0) throw new Error(t('unavailable'));

        closeChatModal();
        await context.selectCharacterById(characterId);
        await context.executeSlashCommandsWithOptions('/newchat', {
            displayCommand: false,
            showOutput: false,
        });

        const generatedName = context.getCurrentChatId?.() || characters[characterId]?.chat;
        if (!generatedName) throw new Error(t('newChatNameMissing'));

        const temporaryChat = { file_name: `${String(generatedName).replace(/\.jsonl$/i, '')}.jsonl` };
        const finalName = await renameChatFile(entry, temporaryChat, requestedName);
        if (finalName && typeof context.openCharacterChat === 'function') {
            await context.openCharacterChat(finalName);
        }
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to create named chat`, error);
        if (typeof toastr !== 'undefined') toastr.error(error.message, EXTENSION_NAME);
    }
}

async function openExactChat(entry, fileName) {
    try {
        const context = SillyTavern?.getContext?.();
        const characters = context?.characters || [];
        const characterId = characters.findIndex(character => character.avatar === entry.avatar);
        if (characterId < 0) throw new Error(t('unavailable'));

        closeChatModal();
        await context.selectCharacterById(characterId);
        const chatName = String(fileName).replace(/\.jsonl$/i, '');
        if (typeof context.openCharacterChat !== 'function') {
            throw new Error(t('openerUnavailable'));
        }
        await context.openCharacterChat(chatName);
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to open chat`, error);
        if (typeof toastr !== 'undefined') {
            toastr.error(error.message, EXTENSION_NAME);
        }
    }
}

function closeChatModal() {
    const overlay = document.getElementById('character-chat-pills-overlay');
    if (!overlay) return;
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 160);
}

function createChatRow(entry, chat) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'character-chat-modal-row';

    const body = document.createElement('span');
    body.className = 'character-chat-modal-row-body';

    const name = document.createElement('strong');
    name.className = 'character-chat-modal-row-name';
    name.textContent = String(chat.file_name || '').replace(/\.jsonl$/i, '') || t('unnamedChat');

    const titleLine = document.createElement('span');
    titleLine.className = 'character-chat-modal-row-title';
    titleLine.appendChild(name);

    if (chat.isLastActive) {
        const latestBadge = document.createElement('span');
        latestBadge.className = 'character-chat-latest-badge';
        latestBadge.innerHTML = `<i class="fa-solid fa-check"></i><span>${t('lastUsed')}</span>`;
        latestBadge.title = t('lastUsedTitle');
        titleLine.appendChild(latestBadge);
    }

    const preview = document.createElement('span');
    preview.className = 'character-chat-modal-row-preview';
    preview.textContent = chat.mes || t('noPreview');

    const stats = document.createElement('span');
    stats.className = 'character-chat-modal-row-stats';
    const count = chat.chat_items ?? chat.mes_count ?? chat.message_count;
    stats.textContent = [formatDate(getChatTimestamp(chat)), count != null ? t('messages', { count }) : '']
        .filter(Boolean)
        .join(' · ');

    const actions = document.createElement('span');
    actions.className = 'character-chat-modal-row-actions';

    const favorite = createIconButton('fa-star', isFavoriteChat(entry, chat) ? t('unfavoriteChat') : t('favoriteChat'), 'character-chat-row-action character-chat-favorite-action');
    favorite.classList.toggle('is-favorite', isFavoriteChat(entry, chat));
    const rename = createIconButton('fa-pen', t('renameChat'), 'character-chat-row-action');
    const remove = createIconButton('fa-trash', t('deleteChat'), 'character-chat-row-action is-danger');
    favorite.addEventListener('click', event => {
        event.stopPropagation();
        const key = getChatKey(entry.avatar, chat.file_name);
        favoriteChats.has(key) ? favoriteChats.delete(key) : favoriteChats.add(key);
        saveStringSet(FAVORITE_CHATS_KEY, favoriteChats);
        const root = row.closest('.character-chat-detail, .character-chat-modal');
        void refreshVisibleChatList(entry, root);
    });
    rename.addEventListener('click', event => {
        event.stopPropagation();
        void renameChat(entry, chat, row);
    });
    remove.addEventListener('click', event => {
        event.stopPropagation();
        void deleteChat(entry, chat, row);
    });
    actions.append(favorite, rename, remove);

    body.append(titleLine, preview, stats);
    row.append(body, actions);
    row.addEventListener('click', () => openExactChat(entry, chat.file_name));
    return row;
}

async function openCharacterChatsModal(entry) {
    closeChatModal();

    const overlay = document.createElement('div');
    overlay.id = 'character-chat-pills-overlay';
    overlay.className = 'character-chat-modal-overlay';

    const modal = document.createElement('section');
    modal.className = 'character-chat-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', t('chatsWith', { name: entry.character.name || t('character') }));

    const header = document.createElement('header');
    header.className = 'character-chat-modal-header';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'character-chat-modal-close';
    close.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    close.title = t('back');
    close.addEventListener('click', closeChatModal);

    const avatar = document.createElement('img');
    avatar.className = 'character-chat-modal-avatar';
    avatar.src = makeAvatarUrl(entry.avatar);
    avatar.alt = '';

    const heading = document.createElement('span');
    heading.className = 'character-chat-modal-heading';
    const title = document.createElement('strong');
    title.textContent = entry.character.name || t('unnamedCharacter');
    const subtitle = document.createElement('span');
    subtitle.dataset.chatCount = '';
    subtitle.textContent = t('loadingChats');
    heading.append(title, subtitle);

    const newChat = document.createElement('button');
    newChat.type = 'button';
    newChat.className = 'character-chat-modal-new';
    newChat.innerHTML = `<i class="fa-solid fa-plus"></i><span>${t('newChat')}</span>`;
    newChat.addEventListener('click', () => createNamedChat(entry));

    header.append(close, avatar, heading, newChat);

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'text_pole character-chat-modal-search';
    search.placeholder = t('findChat');
    search.autocomplete = 'off';

    const list = document.createElement('div');
    list.className = 'character-chat-modal-list';
    showEmptyState(list, t('loadingChats'));

    modal.append(header, search, list);
    overlay.appendChild(modal);
    document.documentElement.appendChild(overlay);

    overlay.addEventListener('click', event => {
        if (event.target === overlay) closeChatModal();
    });

    const escapeHandler = event => {
        if (event.key !== 'Escape' || !overlay.isConnected) return;
        event.stopPropagation();
        closeChatModal();
        document.removeEventListener('keydown', escapeHandler, true);
    };
    document.addEventListener('keydown', escapeHandler, true);

    try {
        const chats = await fetchCharacterChats(entry.avatar);
        sortCharacterChats(entry, chats);
        if (!overlay.isConnected) return;

        subtitle.textContent = t('chatsCount', { count: chats.length });
        list.replaceChildren(...chats.map(chat => createChatRow(entry, chat)));
        if (!chats.length) showEmptyState(list, t('noChats'));

        search.addEventListener('input', () => {
            const query = search.value.trim().toLocaleLowerCase();
            list.querySelectorAll('.character-chat-modal-row').forEach((row, index) => {
                const chat = chats[index];
                const haystack = `${chat.file_name || ''} ${chat.mes || ''}`.toLocaleLowerCase();
                row.hidden = Boolean(query) && !haystack.includes(query);
            });
        });
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to load character chats`, error);
        subtitle.textContent = t('loadChatsFailedShort');
        showEmptyState(list, t('loadChatsFailed'));
    }
}

function createIconButton(icon, label, className = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `character-chat-icon-button ${className}`.trim();
    button.title = label;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    return button;
}

function getFilteredEntries(entries, search, filter) {
    const query = search.trim().toLocaleLowerCase();
    let result = entries.filter(entry => !query || (entry.character.name || '').toLocaleLowerCase().includes(query));

    if (filter === 'frequent') {
        result = [...result].sort((a, b) => b.chats.length - a.chats.length || b.latestTimestamp - a.latestTimestamp);
    } else if (filter === 'active') {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        result = result.filter(entry => entry.latestTimestamp >= weekAgo);
    }

    return result.sort((a, b) => {
        const pinnedDifference = Number(pinnedCharacters.has(b.avatar)) - Number(pinnedCharacters.has(a.avatar));
        if (pinnedDifference) return pinnedDifference;
        if (filter === 'frequent') return b.chats.length - a.chats.length || b.latestTimestamp - a.latestTimestamp;
        return b.latestTimestamp - a.latestTimestamp;
    });
}

function renderCharacterCollection(list, entries, state) {
    const filtered = getFilteredEntries(entries, state.search, state.filter);
    list.dataset.density = state.density;

    const fragment = document.createDocumentFragment();
    filtered.forEach((entry) => {
        const pill = createCharacterPill(entry);
        fragment.appendChild(pill);
    });

    list.replaceChildren(fragment);
    if (!filtered.length) showEmptyState(list, t('noCharacters'));
}

function createSegmentedButton(icon, label, value, state, onSelect) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'character-chat-segment';
    button.dataset.value = value;
    button.classList.toggle('is-active', state === value);
    button.innerHTML = `<i class="fa-solid ${icon}"></i><span>${label}</span>`;
    button.addEventListener('click', () => onSelect(value));
    return button;
}

function renderCharacterBrowser(container, entries) {
    const state = {
        search: '',
        filter: 'recent',
        density: localStorage.getItem('MistraelSL_CharacterChatPills_density')
            || localStorage.getItem('CharacterChatPills_density')
            || 'shelf',
        mobileColumns: Math.min(4, Math.max(2, Number(localStorage.getItem(MOBILE_COLUMNS_KEY)) || 3)),
    };

    container.replaceChildren();
    container.className = 'character-chat-pills-container character-chat-browser';

    const hero = document.createElement('header');
    hero.className = 'character-chat-browser-header';

    const titleBlock = document.createElement('div');
    titleBlock.className = 'character-chat-browser-title';
    titleBlock.innerHTML = `
        <span class="character-chat-browser-kicker">${t('chatLibrary')}</span>
        <strong>${t('chooseCharacter')}</strong>
        <span>${t('characterCount', { count: entries.length })}</span>
    `;

    const densityButtons = document.createElement('div');
    densityButtons.className = 'character-chat-density';
    const shelfButton = createIconButton('fa-table-cells-large', t('portraitShelf'));
    const compactButton = createIconButton('fa-grip', t('compactGrid'));
    densityButtons.append(shelfButton, compactButton);

    const mobileDensity = document.createElement('div');
    mobileDensity.className = 'character-chat-mobile-density';
    mobileDensity.title = t('mobileColumns');
    [2, 3, 4].forEach(columns => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(columns);
        button.addEventListener('click', () => {
            state.mobileColumns = columns;
            localStorage.setItem(MOBILE_COLUMNS_KEY, String(columns));
            refresh();
        });
        mobileDensity.appendChild(button);
    });
    densityButtons.appendChild(mobileDensity);
    hero.append(titleBlock, densityButtons);

    const toolbar = document.createElement('div');
    toolbar.className = 'character-chat-browser-toolbar';

    const searchWrap = document.createElement('label');
    searchWrap.className = 'character-chat-browser-search';
    searchWrap.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = t('findCharacter');
    search.autocomplete = 'off';
    searchWrap.appendChild(search);

    const filters = document.createElement('div');
    filters.className = 'character-chat-browser-filters';

    const list = document.createElement('div');
    list.className = 'character-chat-pills-list';

    const refresh = () => {
        filters.querySelectorAll('.character-chat-segment').forEach(button => {
            button.classList.toggle('is-active', button.dataset.value === state.filter);
        });
        shelfButton.classList.toggle('is-active', state.density === 'shelf');
        compactButton.classList.toggle('is-active', state.density === 'compact');
        mobileDensity.querySelectorAll('button').forEach(button => {
            button.classList.toggle('is-active', Number(button.textContent) === state.mobileColumns);
        });
        list.dataset.mobileColumns = String(state.mobileColumns);
        renderCharacterCollection(list, entries, state);
    };
    container._refreshCharacters = refresh;

    filters.append(
        createSegmentedButton('fa-clock-rotate-left', t('recent'), 'recent', state.filter, value => {
            state.filter = value;
            refresh();
        }),
        createSegmentedButton('fa-fire', t('active'), 'active', state.filter, value => {
            state.filter = value;
            refresh();
        }),
        createSegmentedButton('fa-ranking-star', t('frequent'), 'frequent', state.filter, value => {
            state.filter = value;
            refresh();
        }),
    );

    let searchTimer = null;
    search.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            state.search = search.value;
            refresh();
        }, 120);
    });

    shelfButton.addEventListener('click', () => {
        state.density = 'shelf';
        localStorage.setItem('MistraelSL_CharacterChatPills_density', state.density);
        refresh();
    });
    compactButton.addEventListener('click', () => {
        state.density = 'compact';
        localStorage.setItem('MistraelSL_CharacterChatPills_density', state.density);
        refresh();
    });

    toolbar.append(searchWrap, filters);
    container.append(hero, toolbar, list);
    refresh();
}

function createInlineChatRow(entry, chat) {
    const row = createChatRow(entry, chat);
    row.classList.add('character-chat-detail-row');
    return row;
}

async function openCharacterChats(entry) {
    const container = document.querySelector('.character-chat-pills-container');
    if (!container) {
        await openCharacterChatsModal(entry);
        return;
    }

    const welcomeRecent = container.closest('.welcomeRecent');
    const welcomePanel = container.closest('.welcomePanel');
    const title = welcomePanel?.querySelector('.recentChatsTitle');
    if (title) title.textContent = t('characterChats');

    container.replaceChildren();
    container.className = 'character-chat-pills-container character-chat-detail';

    const header = document.createElement('header');
    header.className = 'character-chat-detail-header';

    const back = createIconButton('fa-arrow-left', t('backToCharacters'), 'character-chat-detail-back');
    const portrait = document.createElement('div');
    portrait.className = 'character-chat-detail-portrait';
    const avatar = document.createElement('img');
    avatar.src = makeAvatarUrl(entry.avatar);
    avatar.alt = entry.character.name || t('character');
    portrait.appendChild(avatar);

    const identity = document.createElement('div');
    identity.className = 'character-chat-detail-identity';
    const kicker = document.createElement('span');
    kicker.textContent = t('conversations');
    const name = document.createElement('strong');
    name.textContent = entry.character.name || t('unnamedCharacter');
    const summary = document.createElement('span');
    summary.dataset.chatCount = '';
    summary.textContent = t('loadingHistory');
    identity.append(kicker, name, summary);

    const newChat = document.createElement('button');
    newChat.type = 'button';
    newChat.className = 'character-chat-detail-new';
    newChat.innerHTML = `<i class="fa-solid fa-plus"></i><span>${t('newChat')}</span>`;
    newChat.addEventListener('click', () => createNamedChat(entry));

    header.append(back, portrait, identity, newChat);

    const controls = document.createElement('div');
    controls.className = 'character-chat-detail-controls';
    const searchWrap = document.createElement('label');
    searchWrap.className = 'character-chat-browser-search';
    searchWrap.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = t('searchChats');
    search.autocomplete = 'off';
    searchWrap.appendChild(search);
    controls.appendChild(searchWrap);

    const list = document.createElement('div');
    list.className = 'character-chat-detail-list';
    showEmptyState(list, t('loadingChats'));
    container.append(header, controls, list);

    const restoreBrowser = async () => {
        const context = SillyTavern?.getContext?.();
        showEmptyState(list, t('loadingCharacters'));
        try {
            const entries = groupChatsByCharacter(await getRecentChats(), context?.characters || []);
            if (title) title.textContent = t('charactersWithChats');
            renderCharacterBrowser(container, entries);
        } catch (error) {
            console.error(`${EXTENSION_NAME}: failed to restore character browser`, error);
            showEmptyState(list, t('returnFailed'));
        }
    };
    back.addEventListener('click', restoreBrowser);

    try {
        const chats = await fetchCharacterChats(entry.avatar);
        sortCharacterChats(entry, chats);
        if (!container.isConnected || !container.classList.contains('character-chat-detail')) return;

        summary.textContent = t('lastActiveSummary', { count: chats.length, date: formatDate(entry.latestTimestamp) });
        list.replaceChildren(...chats.map(chat => createInlineChatRow(entry, chat)));
        if (!chats.length) showEmptyState(list, t('noChats'));

        search.addEventListener('input', () => {
            const query = search.value.trim().toLocaleLowerCase();
            list.querySelectorAll('.character-chat-detail-row').forEach((row, index) => {
                const chat = chats[index];
                const haystack = `${chat.file_name || ''} ${chat.mes || ''}`.toLocaleLowerCase();
                row.hidden = Boolean(query) && !haystack.includes(query);
            });
        });
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to load character chats`, error);
        summary.textContent = t('loadChatsFailedShort');
        showEmptyState(list, t('loadChatsFailed'));
    }
}

function showEmptyState(list, text) {
    list.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'character-chat-pills-empty';
    empty.textContent = text;
    list.appendChild(empty);
}

async function replaceRecentChats(welcomePanel) {
    if (!(welcomePanel instanceof HTMLElement)) return;

    const welcomeRecent = welcomePanel.querySelector('.welcomeRecent');
    if (!welcomeRecent || welcomeRecent.classList.contains(PANEL_CLASS)) return;

    welcomeRecent.classList.add(PANEL_CLASS);
    const title = welcomePanel.querySelector('.recentChatsTitle');
    if (title) title.textContent = t('charactersWithChats');

    const container = document.createElement('div');
    container.className = 'character-chat-pills-container';
    const loading = document.createElement('div');
    loading.className = 'character-chat-pills-list';
    showEmptyState(loading, t('loadingCharacters'));
    container.appendChild(loading);
    welcomeRecent.replaceChildren(container);

    const generation = ++renderGeneration;

    try {
        const context = SillyTavern?.getContext?.();
        const entries = groupChatsByCharacter(await getRecentChats(), context?.characters || []);
        if (generation !== renderGeneration || !welcomePanel.isConnected) return;

        renderCharacterBrowser(container, entries);
    } catch (error) {
        console.error(`${EXTENSION_NAME}: failed to build character list`, error);
        showEmptyState(loading, t('loadCharactersFailed'));
    }
}

function scanWelcomePanels(root = document) {
    if (root instanceof Element && root.matches('.welcomePanel')) {
        void replaceRecentChats(root);
    }
    root.querySelectorAll?.('.welcomePanel').forEach(panel => void replaceRecentChats(panel));
}

function hasOpenChat() {
    const context = globalThis.SillyTavern?.getContext?.();
    return context?.characterId !== undefined
        || Boolean(context?.groupId ?? context?.selectedGroup)
        || Boolean(context?.getCurrentChatId?.());
}

function syncTopCloseButton() {
    const button = document.getElementById('mistraelsl-close-chat-button');
    if (!button) return;

    const label = t('closeChat');
    button.title = label;
    button.setAttribute('aria-label', label);
    button.hidden = !hasOpenChat();
}

function closeChatFromTopBar() {
    const nativeButtons = document.querySelectorAll('#option_close_chat');
    const nativeButton = nativeButtons[nativeButtons.length - 1];
    if (nativeButton instanceof HTMLElement) nativeButton.click();
}

function installTopCloseButton() {
    if (document.getElementById('mistraelsl-close-chat-button')) {
        syncTopCloseButton();
        return;
    }

    const topHolder = document.getElementById('top-settings-holder');
    if (!topHolder) return;

    const aiConfigButton = document.getElementById('ai-config-button');
    if (!aiConfigButton || aiConfigButton.parentElement !== topHolder) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'mistraelsl-close-chat-button';
    wrapper.className = 'drawer mistraelsl-close-chat-button';
    wrapper.hidden = true;
    wrapper.innerHTML = `
        <div class="drawer-toggle drawer-header">
            <div class="drawer-icon fa-solid fa-xmark fa-fw closedIcon interactable" tabindex="0" role="button"></div>
        </div>
    `;
    wrapper.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        closeChatFromTopBar();
    });

    // Insert as a native top-bar drawer immediately before AI Configuration.
    // This lets SillyTavern's own layout and theme spacing control the button.
    topHolder.insertBefore(wrapper, aiConfigButton);
    syncTopCloseButton();
}

function initialize() {
    scanWelcomePanels();
    installTopCloseButton();

    let activeLanguage = getLanguage();
    const updateLanguage = () => {
        const language = getLanguage();
        if (language === activeLanguage) return;

        activeLanguage = language;
        dateFormatters.clear();
        closeChatModal();
        document.querySelectorAll('.welcomePanel').forEach(panel => {
            const welcomeRecent = panel.querySelector('.welcomeRecent');
            welcomeRecent?.classList.remove(PANEL_CLASS);
            void replaceRecentChats(panel);
        });
        syncTopCloseButton();
    };
    const languageObserver = new MutationObserver(updateLanguage);
    languageObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
    });
    setInterval(updateLanguage, 1000);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node instanceof Element) scanWelcomePanels(node);
            });
        }
        installTopCloseButton();
        syncTopCloseButton();
    });

    const chatRoot = document.getElementById('chat') || document.body;
    observer.observe(chatRoot, { childList: true, subtree: false });
    console.info(`${EXTENSION_NAME}: loaded`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}
