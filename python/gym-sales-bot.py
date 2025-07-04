import sys
import time
import signal

def main():
    folder_name = sys.argv[1]
    print(f"Sending messages for: {folder_name}", flush=True)

    # Handle CTRL+C or kill signal gracefully
    def handle_exit(sig, frame):
        print("Script interrupted. Exiting gracefully.", flush=True)
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    # Simulate sending messages with a loop
    for i in range(1, 101):
        print(f"Sending message {i}", flush=True)
        time.sleep(0.5)  # Simulate time taken per message

if __name__ == "__main__":
    main()


