# Draw the face of a clock, with a line and a turtle shape 
# corresponding to each of the 12 hour marks, and another 
# turtle shape at the clock's center.  Note that you can use 
# the stamp method to "stamp" a turtle shape at the turtle's 
# current location.
#
# For an additional challenge, have the user input a time 
# (in hours and minutes) and draw the clock’s hour and 
# minute hands.
#
# From "How to Think Like a Computer Scientist, Interactive Edition":
# http://interactivepython.org/runestone/static/thinkcspy/PythonTurtle/Exercises.html
#
# See also http://www.101computing.net/python-turtle-clock

import turtle

henry = turtle.Turtle()
henry.shape("turtle")
henry.color("red")
screen = henry.getscreen()
screen.bgcolor("white")

# Add your code here
henry.penup()

henry.forward(100)
henry.stamp()

henry.backward(200)
henry.stamp()

henry.left(20)
henry.forward(90)

henry.stamp()

henry.backward(40)

henry.stamp()

henry.right(500)
henry.forward(50)

henry.stamp()

henry.forward(500)
