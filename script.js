
const clientId = '91bdf744e3784735bf5cd46c1945a0f8'; // Замените своим clientId
        const clientSecret = '38459ef5d5954fb18896319a254ed185'; // Замените своим clientSecret

        const getAccessToken = async () => {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
            return data.access_token;
        };

        const searchTracks = async (trackName) => {
            const token = await getAccessToken();
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data.tracks.items;
        };

        const playTrack = (previewUrl) => {
            const audio = document.getElementById('myAudio');
            const audioSource = document.getElementById('audioSource');
            audioSource.src = previewUrl; // Устанавливаем источник аудио
            audio.load(); // Загружаем новый источник
            
            // Играть аудио
            audio.play().then(() => {
                // Обновляем статус плеера
                document.getElementById('playerStatus').textContent = 'Статус: Воспроизводится';
            }).catch(error => {
                console.error('Ошибка воспроизведения:', error);
            });
            
            // Отображать аудиоплеер
            document.getElementById('audioPlayer').style.display = 'flex';
        };

        document.getElementById('search-button').addEventListener('click', async () => {
            const trackName = document.getElementById('song-input').value;
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Очистка предыдущих результатов

            try {
                const tracks = await searchTracks(trackName);
                if (tracks.length > 0) {
                    tracks.forEach(track => {
                        const trackElement = document.createElement('div');
                        trackElement.className = 'track-item';

                        // Создание кнопки для прослушивания трека
                        const listenButton = document.createElement('button');
                        listenButton.textContent = `Слушать ${track.name} - ${track.artists[0].name}`;
                        listenButton.className = 'track-button'; // Применяем стиль кнопки
                        listenButton.onclick = () => playTrack(track.preview_url); // Слушать трек

                        trackElement.appendChild(listenButton);
                        resultsContainer.appendChild(trackElement);
                    });
                } else {
                    resultsContainer.textContent = 'Песни не найдены.';
                }
            } catch (error) {
                resultsContainer.textContent = 'Нихуя не нашёл.';
                console.error('Ошибка:', error);
            }
        });

        const audio = document.getElementById('myAudio');
        const playButton = document.getElementById('playButton');
        const stopButton = document.getElementById('stopButton');
        const volumeControl = document.getElementById('volumeControl');

        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playButton.textContent = 'Играть'; // Сохраняем текст
                document.getElementById('playerStatus').textContent = 'Статус: Воспроизводится'; // Обновляем статус
            } else {
                audio.pause();
                document.getElementById('playerStatus').textContent = 'Статус: Приостановлено'; // Обновляем статус
            }
        });

        stopButton.addEventListener('click', () => {
            audio.pause();
            audio.currentTime = 0; // Сброс времени
            document.getElementById('playerStatus').textContent = 'Статус: Остановлено'; // Обновляем статус
        });

        volumeControl.addEventListener('input', () => {
            audio.volume = volumeControl.value;
        });