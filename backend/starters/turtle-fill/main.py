import turtle

shelly = turtle.Turtle()

#Changing Shelly's colour:
shelly.color("blue")
turtle.Screen().bgcolor("white")

#Using the begin_fill command to start filling in the shape:
shelly.begin_fill()
shelly.forward(50)
shelly.right(120)
shelly.forward(50)
shelly.right(120)
shelly.forward(50)

#End fill command using end_fill
shelly.end_fill()

#This would still work if your shape isn't closed

turtle.done()
