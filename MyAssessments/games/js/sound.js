/*!
 * sound.js Inizializzazione suono
 */
    // --- Gestione Audio ---
    const sounds = {
        correct: new Audio('../../sounds/check-correct.mp3'),
        next_round: new Audio('../../sounds/next-round.mp3'),
        error: new Audio('../../sounds/error.mp3'),
        help: new Audio('../../sounds/help.mp3'),
        click: new Audio('../../sounds/click.mp3'),
        wow: new Audio('../../sounds/wow.mp3')
    };

    Object.values(sounds).forEach(sound => {
        sound.volume = 0.4;
        sound.preload = 'auto';
    });

    let audioUnlocked = false;
    let unlockPromise = Promise.resolve();

    function unlockAudio() {
        if (audioUnlocked) return;
        audioUnlocked = true;
        unlockPromise = Promise.all(Object.values(sounds).map(async s => {
            s.muted = true;
            try {
                await s.play();      // play() is still called synchronously, inside the gesture
                s.pause();
                s.currentTime = 0;
            } catch (err) {
                // ignore: some sounds may fail to unlock
            } finally {
                s.muted = false;
            }
        }));
    }

    // pointerdown too, so the unlock starts before the Help handler runs
    ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'].forEach(evt =>
        document.addEventListener(evt, unlockAudio, { capture: true, passive: true })
    );

    function playSound(key) {
        const s = sounds[key];
        if (!s) return;
        unlockPromise.then(() => {
            s.currentTime = 0;
            return s.play();
        }).catch(err => console.log("Audio play prevented:", err));
    }
