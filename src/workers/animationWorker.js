self.onmessage = async function (event) {
    const { type, day, inputs } = event.data;

    try {
        // Import generator functions z animation.js
        const solverModule = await import(`../components/days/${day}/animation.js`);
        const { solvePart1, solvePart2 } = solverModule;

        // Funkcja pomocnicza do obsługi generatora
        async function processGenerator(generator, messageType) {
            for (const actions of generator) {
                // Akcja z generatora - przesyłamy ją do głównego wątku
                self.postMessage({
                    type: 'animationActions',
                    actions, // Tablica akcji zwrócona przez generator
                });

                // Opcjonalna pauza między krokami (jeśli wymagana jest płynność)
                await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms
            }

            // Gdy generator zwróci wynik końcowy
            const finalResult = generator.return().value || null;
            self.postMessage({
                type: messageType,
                finalResult, // Wynik końcowy
            });
        }

        if (type === 'solvePart1') {
            const generator = solvePart1(...inputs);
            await processGenerator(generator, 'solvePart1');
        } else if (type === 'solvePart2') {
            const generator = solvePart2(...inputs);
            await processGenerator(generator, 'solvePart2');
        } else {
            self.postMessage({ error: 'Invalid task type.' });
        }
    } catch (error) {
        console.error('Error in worker:', error);
        self.postMessage({
            type: 'error',
            error: `Failed to process task: ${error.message}`,
        });
    }
};
