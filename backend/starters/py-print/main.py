import time

def print_bunny(eye):
    print("() ()")
    print(f"({eye}.{eye})")
    print("(   )")

print("bunny printing :)")
time.sleep(1)
print("enter an eye...")
time.sleep(1)

eyeIn = input()

print()
print()

for x in range(10):
    print_bunny(eyeIn)
    print()
    time.sleep(1)
