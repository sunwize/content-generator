export class Typewriter {
    private element: HTMLElement;
    private queue: (() => Promise<void>)[] = [];
    private typingSpeed: number = 50;
    private deletingSpeed: number = 50;
    private onCharacterTyped?: (char: string) => void;
    private timeouts: Array<ReturnType<typeof setTimeout>> = [];
    private isCancelled: boolean = false;
    private pendingPromises: { resolve: () => void; reject: () => void; }[] = [];

    constructor(
        element: HTMLElement,
        options?: {
            typingSpeed?: number;
            deletingSpeed?: number;
            onCharacterTyped?: (char: string) => void;
        },
    ) {
        this.element = element;
        if (options?.typingSpeed !== undefined) {
            this.typingSpeed = options.typingSpeed;
        }
        if (options?.deletingSpeed !== undefined) {
            this.deletingSpeed = options.deletingSpeed;
        }
        if (options?.onCharacterTyped !== undefined) {
            this.onCharacterTyped = options.onCharacterTyped;
        }
    }

    /**
     * Adds a string to the typing queue.
     * @param text The text to type.
     */
    typeString(text: string): Typewriter {
        this.queue.push(() => this._typeString(text));
        return this;
    }

    /**
     * Deletes all text from the element.
     * @param speed Deletion speed (optional).
     */
    deleteAll(speed?: number): Typewriter {
        this.queue.push(() => this._deleteAll(speed));
        return this;
    }

    /**
     * Pauses the typing for a specified duration.
     * @param duration Duration to pause in milliseconds.
     */
    pauseFor(duration: number): Typewriter {
        this.queue.push(() => this._pauseFor(duration));
        return this;
    }

    /**
     * Starts the typing effect.
     */
    async start(): Promise<void> {
        for (const task of this.queue) {
            if (this.isCancelled) break;
            await task();
        }
    }

    /**
     * Cancels all ongoing typing and timeouts.
     */
    public cancel(): void {
        this.isCancelled = true;
        for (const timeoutId of this.timeouts) {
            clearTimeout(timeoutId);
        }
        this.timeouts = [];
        for (const { resolve } of this.pendingPromises) {
            resolve();
        }
        this.pendingPromises = [];
        this.queue = [];
    }

    private async _typeString(text: string): Promise<void> {
        for (const char of text) {
            if (this.isCancelled) break;
            this.element.innerHTML += char;

            // Invoke the onCharacterTyped callback if provided
            if (this.onCharacterTyped) {
                this.onCharacterTyped(char);
            }

            const randomSpeed = this.typingSpeed * (Math.random() * 0.8 + 0.6);

            await this._sleep(randomSpeed);
        }
    }

    private async _deleteAll(speed?: number): Promise<void> {
        const currentText = this.element.innerHTML;
        const deleteSpeed = speed ?? this.deletingSpeed;
        for (let i = currentText.length; i > 0; i--) {
            if (this.isCancelled) break;
            this.element.innerHTML = currentText.substring(0, i - 1);
            await this._sleep(deleteSpeed);
        }
    }

    private async _pauseFor(duration: number): Promise<void> {
        if (this.isCancelled) return;
        await this._sleep(duration);
    }

    private _sleep(ms: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isCancelled) {
                resolve();
                return;
            }
            const timeoutId = setTimeout(() => {
                resolve();
                // Remove the timeoutId from the array after it's executed
                this.timeouts = this.timeouts.filter(id => id !== timeoutId);
            }, ms);
            this.timeouts.push(timeoutId);
            this.pendingPromises.push({ resolve, reject });
        });
    }
}
