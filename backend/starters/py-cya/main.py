import time

print(".", end="")
time.sleep(1)
print(".", end="")
time.sleep(1)
print(".", end="")
time.sleep(1)

print()
print()

print("Welcome to this world!")

time.sleep(1)

print("Would you like to go UP or DOWN?")
print()
print()
time.sleep(1)

direction = input()

if direction == "UP":
    print("You Win :)")
elif direction == "DOWN":
    print("You Lose :)")
else:
    print("Invalid Option :)")
