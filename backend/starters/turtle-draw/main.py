import turtle

screenr = turtle.Screen()
Lewi = turtle.Turtle()
Lewi.shape("arrow")

screenr.bgcolor("black")
screenr.setup(1200, 800)
Lewi.color("white")
Lewi.pensize(5)

colors = ["white", "red", "yellow", "blue", "green"]
color_idx = 0

def space():
    Lewi.forward(10)

def left():
    Lewi.left(90)

def right():
    Lewi.right(90)

def c():
    global color_idx
    color_idx = color_idx + 1
    if color_idx >= len(colors):
        color_idx = 0
    Lewi.color(colors[color_idx])

def z():
    Lewi.clear()

def r():
    Lewi.goto(0, 0)

Lewi.penup()
Lewi.goto(-200, 150)
Lewi.write("Press Space to go forward", move=False, font=("Arial", 20, "normal"))
Lewi.goto(-200, 100)
Lewi.write("Press Left and Right to turn", move=False, font=("Arial", 20, "normal"))
Lewi.goto(-200, 50)
Lewi.write("Press C to change colors", move=False, font=("Arial", 20, "normal"))
Lewi.goto(-200, 0)
Lewi.write("Press Z to clear", move=False, font=("Arial", 20, "normal"))
Lewi.goto(-200, -50)
Lewi.write("Press R to reset position", move=False, font=("Arial", 20, "normal"))
Lewi.goto(-200, -100)
Lewi.pendown()

screenr.onkey(space, "space")
screenr.onkey(right, "Right")
screenr.onkey(left, "Left")
screenr.onkey(c, "c")
screenr.onkey(z, "z")
screenr.onkey(r, "r")
screenr.listen()

turtle.mainloop()
