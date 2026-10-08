## Welcome
Welcome to the Python EBook! 
Follow this YouTube tutorial by clicking the link below. (watch the video up to 2:30; what’s after is not important for now)
<!-- embed-label: Watch this video on YouTube -->
<iframe width="1330" height="748" src="https://www.youtube.com/watch?v=D2cwvpJSBX4"></iframe>
Now, please press the right arrow to continue to the next section!
### What You’ll See
In this Course, you will encounter a few different interactive (and fun) things:
* Normal Text, like what you've been reading
* Links, like this [one](https://liamgao.trinket.io/python-everything-you-need-to-know-to-become-a-master-programmer#/welcome/what-youll-see)
* Vimeo Or Youtube Videos
* Static text
```
like this
```
* Interactive Coding places, like these: 👇

```python.run

```
I recommend that if you don't understand something, you should go tinker in VSCode or PyCharm to try it out. 

### Report A Bug/Get Help
Use this form to submit a bug or get help.
<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSe2sQkqyS9afzmsd80UXVUk_um2r-O-Y4SbFy3z8CK9S-Ql9g/viewform?embedded=true" width="640" height="458" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>


Sidenote: Now, there is no need for a “Navigating Trinket” or “Create your first Trinket” section, because this course is no longer on Trinket. In the future, you will either be asked to code on your own computer using Pycharm or VSCode, move to PythonAnywhere, or use the built-in editor on the future website this is to be hosted on. 
## Hello World!
Welcome to the first unit of this course! To get started, hit the next button to learn about what Python is. 
### What is Python?
Python is a object oriented language. Think about it this way: Python is a user-friendly programming language, rather than a computer-friendly one. 
       
This is an example of how easy Python is: And don't worry if you don't know what this means, we'll be learning what this does soon. 
       
```
print("hello world")
```
### Two Basic Functions
When you learn Python, there are two basic functions that most people would agree are the easiest to learn and use. Here are the two of them (we talked about one in the [last section](https://liamgao.trinket.io/python-basics#/hello-world/what-is-python)). 
```
print
input
```
If you guessed correctly in the last section, the `print` function prints in the console whatever you type into the quotation marks. Give the following a try by pressing the "run" button. Feel free to make it print different things.
```python.run
#!/bin/python3
print('hello world')
```
Ok, lets explore the ```input``` function now. The input function allows the user to input something that you can work with. Let me give an example before you can try it as this function is just a bit more complicated. For example, running:
```
input()
```
will just display a place to type. What if we wanted to save the input, for example. We can set the ```input``` function to a variable. (Don't worry if you don't quite get the concept of variables, we'll talk about them right after this.)
```
my_variable = input()
```
*Sidenote: We usally don't include spaces in variable names because it messes with how Python interprets it. *
Now, what if we wanted to ask the user a question, like "What is your age?" Well, we could do:
```
print('What is your age?')
age = input()
```
*Console: Place where you run and type your code
*
(You can try that below when we get to the console)
But, the people writing Python thought of that, so you can do this instead, putting your question right inside the function
```
input("What is your age?")
```
Ok, let's have you try asking a question to the user:
```python.run
input("What is your age?")
```
*Bonus: Try changing the question*

Check what you've learned:
```quiz.multi
Question: Which function displays text in the console?
- input()
- print()
- open()
Answer: print()
Feedback: print() displays text in the console.

Question: What type of value does input() return?
- A string
- A number
- A list
Answer: A string
Feedback: Even if the user types digits, input() returns text.

Question: Fill in the function that asks the user for a response: age = {{blank}}("How old are you?").
Answer: input | input()
Feedback: The input() function prompts the user and returns their response.
```
```quiz.code
Prompt: Finish the function so it greets the user when a name is provided.
Code:
def greet(name):
    {{blank}}
    {{blank}}
Answer:
if name:
---
    print("Hello, " + name)
Feedback: The print() function displays the greeting.
```
### Numbers and Operations
Python can also do math! And it's very simple. All you have to do is type what you the operation. 
* Addition is +
* Subtraction is -
* Multiplication is *
* Division is /
* Making something to the power of something else is **
* Modulus is %

Lets try something
```python.run
1+1
```
If you run it by clicking the run button, and you will see nothing happens! This is because we didn't tell Python to actually print the result. Try making it so that we see "2" in the console
***
You should have done:

```
print(1+1)
```
If you didn't do it already, go ahead and copy that code into the console and hit run!
Try some of the other operations in the exact same way!
Check what you've learned:
```quiz.multi
Question: How do you raise one number to the power of another in Python?
- ^
- **
- pow()
Answer: **
Feedback: Conventionally, ^ is used, but in Python, we use two asterisks (**) to raise one number to the power of another.


Question: Make the following function compute: age = {{blank}}((3)^2 * (4+3))
Answer: print() | print
Feedback: The print function can print out the result of something. 
```
### Simple Variables and Types of Data Values
You might think it's a bit early to talk about variables, but they are really simple. Moreover, everything else about Python is built on variables. Now, the first step of creating a variable is giving it a name. Let's create a variable called bob like this:
```
bob = 
```
Now, what comes after the equals sign is what the value of bob is. In Python, there are four main types of data values, or different types of things you can store in variables. There are strings, integers, floats, and booleans. Python is really picky of what type is which and can spit out errors if you use the wrong ones.

*Important!*: Variable names can be creative, but they must follow the three rules:
1. They can't start with a number (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0)
2. They can't contain special characters. Some examples are: !@#$%^&*()<>?/`~., When in doubt, don't include it.
3. It can't have these words:
```
and       del       from      None      True
as        elif      global    nonlocal  try
assert    else      if        not       while
break     except    import    or        with
class     False     in        pass      yield
continue  finally   is        raise
def       for       lambda    return
```
These words mean something else, and we'll talk about them later. 

**Strings**: You have already have encountered strings! When you do 
```
print("hello world")
```
"hello world" is accually a string. Strings are bounded by quotation marks ("") and are used to store text value. Variables can store text value. For example, we can set bob equal to orange.
```
bob = "orange"
```
Be careful! If you forget the quotation marks around orange, Python will think you are setting the variable bob equal to a variable called orange. The thing is, you havn't defined the variable orange yet, so Python will give you this error:
```
NameError: name 'orange' is not defined on line 2 in main.py
```
What happens now if we try to print bob? Bob is an variable, so we can print it without the quotation marks. Think about it this way: When you print something, the thing that you are trying to print goes inside the quotation marks. 
```python.run
bob = "orange"
print(bob)
```
We get "orange"!

**Integers:** You also have previously encountered these in the [numbers and operations](https://liamgao.trinket.io/python-basics#/hello-world/numbers-and-operations) section! Numbers you can type just by hitting the numbers on your keyboard, no fancy quotation marks or anything. They will turn purple inside the console. We already saw the function of using operations on numbers in the last section. But for this section, I have something a little different. Now, we know both numbers and strings what happens when you do this?
```
print("1"+"1")
```
Try clicking the run button
```python.run
print("1"+"1")
```
11, hmm. Thats weird. Maybe the two ones got combined? Lets try it with apple and orange. Put the code into the console above
```
print("apple"+"orange")
```
appleorange. It seems so. Indeed, adding two strings together combines them. What if we add an number and a string?
```
print(1+"1")
```
Oh no! What happened?
```
TypeError: cannot concatenate 'str' and 'int' objects on line 1 in main.py
```
Python does not like putting a string and a variable together, so it will refuse to do so. You will see that in the error message, it says that it can not put together 'str' and 'int', meaning strings and integers. 

**Floats**: Floats are just a fancy word for decimals. When I was learning python, I learned this funny sheep diagram that shows the difference between integers and floats. 
![0.5 a sheep?!](https://preview.redd.it/what-a-point-5-sheep-v0-m9zx8z83ei7e1.jpeg?auto=webp&s=fc8009a92025d31edd66e52513eddbc9455bcd84)
We can do all the operations with floats, but what happens when we try to add a float to an integer?
```python.run
print(0.5+1)
```
We get 1.5! Just like with normal variables. Integers are floats are very closely related, with few distinguishing characteristics. 

**Boolean**: Booleans are very simple. They can only be in two states: True and False. We'll talk more about them later when we get into if loops. 

**How Can I change the type of data value?**
You can use three main functions to change the data value
```
str()
int()
float()
```
For the ```str()``` function, you can take any integer or float and change it into a string. Pretty simple. 
For the ```int()```
function, you can take and float or string THAT IS A NUMBER and change it into an integer. For floats, when you change them to an integer, they will always round down. For the ```float()``` function, you can change any string that is an number or decimal to a float. All integers will have a .0 after them when you change them into floats.

**Bonus!** Try and combine the `input()` function and the variables to make the 

Check what you've learned:
```quiz.multi
Question: What is the result of print("hello"+"world")
- hello world
- helloworld
- Error
- HelloWorld
Answer: helloworld
Feedback: The + operator on strings joins them together without a space. 

Question: Complete the statement: an Int can have {{blank}} decimal digits. 
Answer: 0 | no | zero
Feedback: An Int cannot have decimal points. Only a float can. 

Question: How can I set the variable age to 12 years old? (int, not string)
- age = "12"
- age = 12
- 12 = age
- "age" = "12
Answer: age = 12
Feedback: An int does not require quotation marks, and there should never be quotes around the name of a variable. 

Question: Which of the following can you not start a Python variable with? (Select all that apply)
Type: multi-select
- A capital letter
- A special symbol 
- A number
- A lowercase letter
Answer: A special symbol | A number
Feedback: As listed above, Python variables may not start with a special symbol or a number. 

Question: What happens when I try to do print("nine" + 7)?
- Error
- 16
- nine7
- 97
Answer: Error
Feedback: You cannot add a string and an int together. 
```
### Adding Strings?
Belive it or not, you can also do math operations on strings!

**Adding Strings:** Adding strings simpliy joins them together:
```python.run
"apple" + "orange"
```
We call this Concatenation. You'll learn more about that on the next page. 

**Mutiplying Strings**: Mutiplying Strings repeats the string mutiple times. For example:
```python.run
"hi"*3
```
### Concatenation
As mentioned on the previous page, you can add strings. That's not the only method of concatenation, though. There are three different ways to concatonate strings. 
***
1: Using the + symbol. 
As we disucssed in the previous section, you can add two strings together, like so:

```python.run
var1 = "apple"
var2 = "bannana"
print(var1+var2)
```
2: Using a comma. See the example:

```python.run
#!/bin/python3
var1 = "apple"
var2 = "bannana"
print(var1, var2)
```
You might have noticed, but this inserted a space between the two. This is just the nature of the comma. 

3: Using an `f` string. Do so like this:
```python.run
var1 = "apple"
print(f"Hello {var1}")
```
Check what you've learned:
```quiz.multi
Question: Which concatenation method adds a space between the things getting concatenated?
- ,
- +
Answer: ,
Feedback: Using a comma automatically adds a space between the two (or more) items getting concatenated. 

Question: In an f string, how would I insert the variable I want to concatenate?
- Brackets ({})
- Parenthesis (())
- Square Brackets ([])
- Backslashes (\\)
- Pipe Symbol (||)
Answer: Brackets ({})
Feedback: As seen above, you brackets to add your variable to the string (e.g. print(f"Hello, {name}")
```
### PROJECT 1: Calculator
In the last part of "Hello World!", we are going to be making our first project! A calculator that does addition. Here is what we are going to be making today. You can play around with it by clicking the run button
```python.run.hidden
numone = float(input('What is the first number?'))
numtwo = float(input('What is the second number?'))
sum = numone+numtwo
print("The sum is", sum)
```

Before we get started, you will need to create a new trinket. Review how to do that [here](https://liamgao.trinket.io/python-basics#/hello-world/create-your-first-trinket).



Ok, let's get started. First, we will need to get the input from the user for the first number. If you remember, we can use the input function. For clarity, let's set the name of the function to numone, as in the first of the two numbers we are going to add together.
```
numone = input("What is the first number?")
```
Ok. Let's do the same for the second number. Try and do it without looking at the answers below. 
```
numtwo = input("What is the second number?")
```
Now, we have to go about the task of adding the two numbers together. If you remember, this is accually really easy, we can just put a + sign between the two numbers. Now, you might think that we can just create another variable and set it equal to ```numone + numtwo```
but NO! Right now, numone and numtwo are in string form because the ```input()``` function always returns strings, so if you try and do 1+1, it will be 11. See if you can use the ```float()``` function to turn the strings into integers. 

*Sidenote: Using the `float` function instead of using the `int` function allow the user to input decimal places, like 5.6*
****
Your code should end up like this:
```
numone = float(input("What is the first number?"))
numtwo = float(input("What is your second number?"))
```

Now, let's create another variable that determins the sum of the numone and numtwo. Let's call it sum. Can you try first?

Ok, here is what you should end up with:
```
sum = numone + numtwo
```
Putting these all together and adding a ```print(sum)``` at the end results in:
```
numone = float(input("What is the first number?"))
numtwo = float(input("What is your second number?"))
sum = numone + numtwo
print(sum)
```
*Bonus: Try making a subtraction or mutiplication calculator.*

**Debugging!**
If you end up with bugs, look here!
* My code returns the two numbers joined together instead of their sum: Make sure you included the int() functions around the input() functions.
* I have the error (replace -- with your line number) ```SyntaxError: bad input on line -- in main.py``` or ```SyntaxError: bad token on line -- in main.py```, check that you have closed all () and ""```


## Loops and If Statements
Variables are pretty useless if we can't compare them in order to determine which operations to do on them...
### What Are Loops?
Loops are a type of Python code that is used to repeat an action mutiple times. If statements are used to determine if something is true and do an action accordingly. Here are the two main loops used in Python: (Don't worry, we'll learn all of this in the later parts of this section.)
```
for x in range():

```
```
while x == True:
```
Here are examples of If loops and try and except loops:
```
if x == "bob":
    ...
elif x == "joe":
    ...
else:
    ...
```
```
try:
    ...
except SyntaxError:
    ...
```
Let's learn what some of these things do. 
### For x in range():
This loop might seems simple at first, but when you dig deeper, it accually has many uses. This loop, when used the simplist, is a repeat loop, executing the code inside of it a set number of times. Here is a simple example:
```python.run
for x in range(10):
    print("meow")
```
You can see that the word "meow" printed 10 times beccause I put the number 10 inside ```range()```. Can you make the word "woof" print 15 times?

Compare your code:
```
for x in range(15):
    print("woof")
```

####Key Points to Remember:
1. Always have a colon (:) at the end of the first line
2. Everything you want repeated has to have an indent (to create one, hit the "tab" button)
3. To prevent things you don't want to repeat from repeating, make the rest of you code un-indented. For example, if I wanted to print "meow" ten times and then "woof" once, I need to put woof outside the loop like so:
```
for x in range(10):
    print("meow")
print("woof")
```

###Diving Deeper:
For loops have more potential than this! If we examine `for x in range():` closer, we can see `x` is a variable. Lets see what happens when we try printing x
``` python.run
for x in range(10):
    print(x)
```
Hmmm, that's interesting. `x` counts from 0 to nine, incrementing each time the loop is run. Python counts from 0, not 1, so x will increment starting at zero for the first run through of the loop. 

Furthermore, the `range()` part of the loop can also be swapped out, but we'll get to that later when we talk about lists. 

Check what you've learned:
```quiz.multi
Question: Complete the phrase: The range() function starts at {{blank}}.
Answer: zero | 0
Feedback: Like we discovered in "Diving Deeper", range starts counting from 0. 

Question: Fill in the code to make the program print "hello world" 12 times.
Code:
for x in range({{blank}}):
    {{blank}}({{blank}})
Answer: 12
---
print
---
"hello world"
Feedback: range(12) repeats the loop 12 times, and print("hello world") displays the message.

Question: Fill in the function that asks the user for a response: age = {{blank}}("How old are you?").
Answer: input | input()
Feedback: The input() function prompts the user and returns their response.
```
### If Statements
*Before we start*: We need to come back to something we refrained from talking about in the [simple variables and types of data values](https://liamgao.trinket.io/python-basics#/hello-world/simple-variables-and-types-of-data-values) section. Booleans. As previously mentioned, they can only be in two states, True and False (make sure to capitalize the T in true and the F in false). When we do if statements, we check the condition of, say a variable to determine what code to run, so we can check if a variable is set to True, to run a code. You could always just set the variable to a string that is "true", but Booleans make it more convenient. 

Now that we know how booleans work, lets use our newfound knowledge and set `x` to True. I want to make it so that when `x = True`, the program prints "Yay!", otherwise the program prints "Noo!". Let me give an example, and then we can discuss how the example works. 
```
if x == True:
    print("Yay!")
else:
    print("Noo!")
```
Now, the first line does all the work seeing if the variable x is equal to True. When we want to see if something is equal to something else, we use `==` , while when we want to set something, say a variable to value, we use `=`. Now, the second line tells the computer what to do if x is equal to True, in this case, print "Yay!". The third line tells the computer what to do in the case that x is equal to anything else that is not "True". The "else" part of an if statement is optional, you don't have to include it. If you don't, the computer will simpily move on to the next part of the code if the condition is not satified. The last line just tells the computer what to do if when the "else" is triggered. 

Tip! Be sure to include quotation marks ("") if you are checking if something is a string!

Let's make this a bit more complicated. Now, let's make `x` a string. Let's make the if loop check for two condidtions, and then make it do something else if neither of the conditions are satisfied. Let's make the first condition the if statement checks for is that if the variable x is equal to "apple", and the the second condition if the variable x is equal to the string "orange". Like last time, let's start with an example, and then an explination:
```
if x == "apple":
    print("Yay!")
elif x == "orange":
    print("Huh?")
else:
    print("Noo!")
```
The first line, just like last time, checks if x is equal to "apple". If so, the second line prints "Yay!". Now, the third line is a bit differnet. "elif" is a shortened word where the words "else" and "if" are squeezed together. This means that if the first condition ("apple") is not satified, it will check whether x is equal to "orange", and lastly, if x is not equal to "apple" or "orange", it will print("Noo!").

#### Things to Watch Out For
1. Make sure to inclue a colon (:) after each "if ... <span class="red">:</span>". 
2. Make sure to indent the information that is inside the "if"
3. Make sure all variables are defined (aka. Have a value and are set) before the if statement.

Since we didn't have any interactive examples, let's have a little practice round. Let's have a variable called "bob", and bob is set to "blueberry". Use an if statement to print "Yummy!" if bob is set to "blueberry" and "Ewww!" if bob is set to anything else. Press <i class="fa fa-play"></i> to run your code. Challenge yourself to not copy and paste from above. 
```python.run
bob = "blueberry"
```
Here is an extra challenge! Now, bob is set to "durian". Edit your existing if loop to make it so that if bob is set to "durian", it will print "Stinky!", but if you change bob back to blueberry, it will still say, "Yummy!". See if you can also figure out how to set bob to "durian" before your if loop. 

**Answers!**

Challenge 1: Your if loop should look something like this:
```
if bob == "blueberry":
    print("Yummy")
else:
    print("Ewww!")
```
Challenge 2: You can change bob to "durian" by editing the first line like so:
```
bob = "durian"
```
Now, your edited if statement should look something like this:
```
if bob == "blueberry":
    print("Yummy")
elif bob == "durian":
    print("Stinky!")
else:
    print("Ewww!")
```
### If Statements II
You can also you different operations on If statments. For example:
```
bob = 1
steve = 2
if bob < steve:
    print("Woof")
```
Would print "woof" because bob is less than steve. 
***
You can also use `<=` as less than or equal to and `>=` for greater than or equal to. 
***
The sign `!=` is for not equal to. For example:
```
bob = True
steve = False
if bob != steve:
    print("Bob is not equal to Steve")
```
This would print "bob is not equal to steve" because bob is `True` and Steve is `False`. 
### While Loops
While loops repeat something continuesly until a condidition is satified. Let's start with the simpilist of while loops. The forever loop. If you want something to repeat forever, you can use `while True:`. If you want to get out of your forever loop, you can use the `break` function. You can skip ahead to [ here](https://liamgao.trinket.io/python-basics#/functions-and-more-functions/break-time-not-really) to read a quick bit on how to use the "break" function, but that's not really important right now. If I do:
```
while True:
    print("meow")
```
It will print "meow" forever, with no end in sight (good thing I didn't make that interactive). Ok, let's move on to something more complicated. Let's set `x` to 1. Now, what if I want the loop to repeat 5 times (Yes, you could do this with a `for x in range` loop, (commonly refered to as a for loop), but for the purposes for explaining a while loop, we'll use that example. You can achive many different things with while loops, but for our first example, we'll stick with the simplist (even though not very practical) example). Here is an example:
```
x = 1

while x <= 5:
    print(x)
    x += 1

```
Now, this code is a bit more complicated. First, we are setting `x` to 1, like previously mentioned. Next, we are saying that while x is less than or equal to (<=) 5, we are going to:
1. Print `x`
2. Add 1 to `x`. We can achive that by using the +=, or you could do 
```
x = x+1
```
They both work, it just depends on how you want to do it. 

Ok. Now that you get the hang of it, let's take a look back at our Addition Caluculator from PROJECT 1. If you recall, our code ended like this:
```python.run
numone = int(input("What is the first number?"))
numtwo = int(input("What is your second number?"))
sum = numone + numtwo
print(sum)
```
*Challenge: You can just read along, you don't have to do it independently if you feel it is too hard: *The thing is, we can only use it once, and then we have to start again. This is a great place to put our while loop to action. Let's create a variable called "again". We'll set this to "Yes" if our user wants to use the calculator again, and "No" if our user wants to stop. Can you ask the user if they want to go again using the input function at the end of our script and set the user's answer to the variable "again"? Make sure the user knows to type in "Yes" or "No" by telling them in the question! Also, make sure to set `again` to "Yes" at the beginning, or else, our code won't run at all once we put the while loop around it. 

Ok, let's now put a while loop around the whole thing, and run while the variable again is equal to "Yes". Can you do it without my help? Don't forget your indents 😃!

Ok, our code should look like this now:
```
again = "Yes"
while again == "Yes":
    numone = int(input("What is the first number?"))
    numtwo = int(input("What is your second number?"))
    sum = numone + numtwo
    print(sum)
    again = input("Do you want to go again? (Yes or No)")
```
Okay. Don't worry if you didn't get that one, it was a hard one. If you didn't, let me explain how our edited code works. So, using the while loop, we are checking if the the response from the user is "Yes". If so, we are doing it again. If the user types in anything but "Yes", the while loop automatically quits because the condition (again == "Yes") is not sataified anymore. Finally, when they quit, let's say "Bye Bye" to our user. You can use the print function outside the while loop (not indented) to say "Bye Bye"
```
again = "Yes"
while again == "Yes":
    numone = int(input("What is the first number?"))
    numtwo = int(input("What is your second number?"))
    sum = numone + numtwo
    print(sum)
    again = input("Do you want to go again? (Yes or No)")
print("Bye Bye")
```

### Try and Except Statements
You know all those nasty errors that pop up when something goes wrong? While, if you are not sure if something will work or not, you can put it in a try/except statement, which will try to do something, and if it does not work, you can make it do something else. For example:
```
xyz = "Hello"
try:
    print("xyz")
except:
    print("There was an error")
```
So in this case, we are trying to print "Hello", and if there is an error, we are going to print "There was an error". But right now, since I made no mistakes and xyz is defined, it will print "Hello". But, if forgot to define `xyz`, it will print "There was an error" because it could not know what xyz was. If I didn't do try/except, it would have printed `NameError: xyz is not defined`. 
Try it yourself by making some intentional errors:
```python.run

```
### Loop Inside a Loop?!
Yes, you can put a loop inside a loop. For example:
```
for x in range(5):
    for x in range(2):
        print("hi")
```
How many times does this print hi? Try and figure it out:
```python.run
for x in range(5):
    for x in range(2):
        print("hi")
```
You might have expected this. 5 * 2 = 10, because the outside loop runs 5 times, each of those times, the inside loops runs twice. 

What about an If loop inside an if loop? Yes. For example, if I set "bob" to 5, we can make a two if loop statement like so:
```
if bob > 3:
    print("Greater than 3")
    if bob > 10:
        print("Greater than 10")
```
Now, what happens when you try to run it?
```python.run
bob = 5
if bob > 3:
    print("Greater than 3")
    if bob > 10:
        print("Greater than 10")
```
As you might have expected, it only prints "Greater than 3" because `bob` satifies the first condition but not the second. 

You can also mix and match! Putting different loops inside other loops. 

Now, while loops can also be looped inside a loop like the above, but here are some points to remember when putting a loop inside a loop:

####Points to remember when putting a loop in a loop:
1. Follow all the tips for those loops. 
2. Make sure to indent properly. If trinket does not do it automatically (which it does most of the time, make sure to indent properly.

## Logical Operators
### What are Logical Operators?
In the previous section about if loops, we only covered if loops that do something based on one input. For example:
```
bob = True
if bob == True:
    print("Yay")
else:
    print("No")
```
Now, what if you want to do this though?
```
bob = True
steve = False
```
And only make your program print "Yay" when both bob and steve are equal to true? Well, that's what we are going to be covering in this section.
### And
You can use this operator when you want to check if both values are true. For example, if I have the following:
```
apple = True
orange = False
```
You can use the `and` operator to check if BOTH apple and orange are true. You would do this with a if loop like this:
```
if apple == True and orange == True:
    print("hi")
else:
    print("bye")
```
Try and guess what happens when I run this code! If you guessed that the program would print "bye", you'd be correct! Because apple is true and orange is false, the condition would not be satified. Try the practice below!
***
Practice 1: Determine the outcome of the following pieces of code. The answers are at the bottom of the page. 

1. ```
bob = True
steve = True
if bob == True and Steve == True:
        print("Hi")
elif bob == True and Steve == False:
        print("Bye")
else:
        print("Meow")
```
2. ```
apple = False
orange = False
if apple == False and orange == False:
        print("Hi")
```

Practice 2: If I want the code below to print "hi" only when BOTH apple and orange are True, how would I do that? Put your answer in the interactive code consolse below. 
```python.run
apple = True
orange = False
```

**ANSWERS**:
Practice 1.1: Hi

Practice 1.2: Hi

Practice 2:
```
if apple == True and orange == True:
    print("Hi")
```

### Or
This is similar to the and operator, but this means the loop will run if either one of the variables are true. Let's start with an example. 
```
apple = True
orange = False
if apple == True or orange == True:
    print("Hi")
```
What happens? Before looking down, make a guess. 
***
Run the program below to find out what happens. 
```python.run
apple = True
orange = False
if apple == True or orange == True:
    print("Hi")
```
If you geussed that it would print out a result, you'd be right. That's because only one of the values need to be true in order for the statement to be satified. Try these practice problems. 
****
Practice 1: Finish the code so it prints "Hi" when either bob or steve are true. 
```python.run
bob = False
steve = True
```
Answers:
1. 
```
if bob == True or steve = True:
    print("Hi")
```
### Not
This operator also does what the name implies. This operation checks if something is `not` something else. You'll see where this is used later (if you want, you can skip to it [Using Lists](https://trinket.io/liamgao/courses/python#/lists-dictionaries-and-tuples/using-lists) )

## Lists, Dictionaries, and Tuples
### What’s a list?
Imagine I have my height in inches over a year. There are a lot of data points, so it would be a waste to create a variable for each one. What do I do? Well, I should create a list. Lists can store large amounts of data, like so:
```
height = [54.5, 55.0, 55.5, 56.0, 56.5, 57.0, 57.5, 58.0]
```
Let's make some observations. Lists are surrounded by square brackets, and each item in the list is seperated by a comma. Lists can also store strings:
```
fruit = ["apple", "orange", "banana", "lemon", "blueberry"]
```
Now, just like with the for loops, Python starts counting at zero, so:
```
fruit = ["apple", "orange", "banana", "lemon", "blueberry"]
```
                0         1         2         3          4
The index (number in the list) of the fruits are listed below the fruits. Ok, say that I want to add something to the list, how can I do that? We'll explore that in the next section

### Using Lists
####List Functions:
Click on the links to be directed straight to that section. If it is your first time, and you are not looking back for help, read the whole thing in order. 

**Functions**
1. [Adding Items to a list using `append()`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-append-)
2. [Inserting items to the middle of a list using `insert()`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-insert-)
3. [Removing Items using `remove()`, `pop()` and `del`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-remove-pop-and-del-)
4. [Getting items from lists using `[]`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-)
5. [Getting multiple items using `[ : ]`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-)
6. [Mushing 2 lists together with `extend()`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-)
7. [Finding Length using `len()`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-len-)
8. [Checking Membership using `in` and `not in`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-in-not-in-)
9. [Sorting Lists using `sort()`](http://example.com/)
10. [Revesing Lists Using `reverse()`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists#-reverse-)

###`append()`
To add something to a list, we can use the `append()` function, putting what we want to add to the list in the parentheses.  For example:
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
fruits.append("strawberry")
print(fruits)
```
As you can see, strawberry has been added to the list at the end of everything. To use the `append()` function, you put `nameoflist.append(whatyouwanttoappend)`. If you are appending a string, don't forget the quotation marks! 

###`insert()`
How can you add items to a list in the middle of the list? You use the `insert()` function. The insert function excepts two values. The first is the index where you want to insert the values. For example, if I wanted to insert strawberry between orange and banana, that would be index 2, because appple is index (number) 0 and and orange is index 1, so strawberry would be index 2 once inserted. The second value the `insert()`is what you want to insert, in this case, "strawberry". So we have:
```
fruits.insert(2, "strawberry")
```
Let's try it!
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
fruits.insert(2, "strawberry")
print(fruits)
```

###`remove()`, `pop()` and `del`
How can I remove an item from a list? There are three different ways to do this: `remove()`, `pop()` and `del`. 
1. Using the `remove()` method: The remove method removes the first instance of an item. For example, if I had my list of fruits again: `fruits = ["apple", "orange", "banana", "lemon", "blueberry", "orange"]`, this time having two "orange", the `remove()` method will only remove the first one:
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry", "orange"]
fruits.remove("orange")
print(fruits)
```
See, it removed the first "orange" but not the second.
2. Using the "pop()" method. The `pop()` method removes the item, and also returns the value of the item it removed. Instead of taking the item you want removed, it will take the index of the item you want removed. For example
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry", "orange"]
removed_fruit = fruits.pop(1)
print(removed_fruit)
print(fruits)
```
You see, it removed the "orange" at index 1, but not the orange at index 5 (before the `pop()`) 
3. The `del` statement: You put the `del` statement before the name of the list and then the index of what you want to delete. For example
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
del fruits[2]
print(fruits)
```
It removed the value at index 2, "banana". You can also del the whole list, by
```
del fruits
```
If you want to delete a lot of the list at once, you can also use the `del` function. Inside the brackets, put [index of first one (will be removed:index of the last one (will not be removed)]. If we take our `fruits` example again:
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
del fruits[0:2]
print(fruits)
```
Remember! Python Indexing starts at zero. 
    
###`[]`
How can I get an item from a list? We can use square brackets! All you have to do is type the index of the value in the square brackets, and then, it will return the value from the index. Remember, indexing/counting in Python starts at 0! For example:
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
print(fruits[1])
```
Once you get this data, you can do whatever you like with it.

###`[ : ]`
Remove mutiple items? Well, just like when we deleted mutiple items, we can use the colon (:). For example
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
print(fruits[1:3])
```
As you see, Python will return this as a seperate list. 
* What if I wanted to change an existing item in the list? Well, we can use this format:
```
fruits[3] = "Grape"
```
Where we have fruits as the name of the list, 3 as the index of what we want to change, and Grape as what we want to change it to. 
###`extend()`
* What If I wanted to mush together two lists? Well, I can use the `extend()` function. In the parentheses go the list that I want to add to the end of the previous list. Of course, include your brackets.
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
fruits.extend(["strawberry", "kiwi"])
print(fruits)
```
###`len()`
We can find the length of a list using the len() function. Now, this one works a bit different. You put the name of the list inside the parentheses and it returns the length of the list. For example:
``` python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
print(len(fruits))
```
You see, it returns 5 because there are 5 items in the `fruits` list. 

###`in` & `not in`
You can check if something is in the list using `in` and `not in`. These will return Booleans: `True` or `False`. For example:
``` 
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
print("apple" in fruits)
```
Can you geuss what happens? Of course, it returns
```python
>>> True
```
Because "apple" is clearly in the list `fruits`(it's the first one). You can also use `not in` in the same way.  
``` 
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
print("pear" not in fruits)
```
What happens now?
```python
>>> True
```
Of course, `True` again! This is because "pear" is not in the list `fruits`.

###`sort()`
Now, this is quite a peculiar function. Let me give some examples, and then you can try and geuss what it does:
```python.run
numbers = [5, 2, 7, 3]
numbers.sort()
print(numbers)
```
And another one:
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
fruits.sort()
print(fruits)
```
Let's look at the numbers first. If you couldn't tell, they  have been sorted by value, from least to greatest. The second example, which consisted of strings, were sorted by alphabetical order. You can use this method `sort()` to sort the lists. You don't need anything in the parentheses, and you can just to this:
```
fruits.sort()
```

###`reverse()`
You can use the `reverse()` function to reverse the order of the items in a list. 
```python.run
fruits = ["apple", "orange", "banana", "lemon", "blueberry"]
fruits.reverse()
print(fruits)
```
All of this may seem hard at first, but after using it for a while, it will all become really familiar. If you ever need to, don't be afraid to check back here to review how to do something.



### 2D Lists
You can also put a list inside a list! We call these 2D lists. For example
```
fruits = [["apple", "orange"], 
        ["banana", "kiwi"], 
        ["strawberry", "blueberry"]]
```
At first, these might not seem useful, but just keep in mind you can do this, and we'll use this when we make our, rock, paper, scissors, project. 
### Using Lists with For Loops
Remember the lists we talked about? Well, we can use them for lists to? Remember how I said we would leave `range()` alone, well, now, we are going to mess around with that. The best way to do this is to start with an example and see what happens. 
```python.run
fruit = ["apple", "orange", "banana", "lemon", "blueberry"]
for x in fruit:
    print("hi")
```
It printed `hi` 5 times? How many items are in `fruit`? 5! Is this a coincidence? No! You see, when we say `for x in fruit:`, it will cycle through `fruit`, for each item in fruit. What happens when we try and print x?
```python.run
fruit = ["apple", "orange", "banana", "lemon", "blueberry"]
for x in fruit:
    print(x)
```
Now, we see that when the loop cycles through, `x` is each item in the list. Most of the the stuff we are learning right now might not seem particularly useful at first, but it will all come together when we make, rock, paper, scissors.  
### What’s a Dictionary?
Let's say I wanted to store the name of multiple people, along with their age. I could use a 2D list, like this:
```
age_and_name = [["Bob", 12], ["Steve", 14], ["Joe", 9], ["Mark", 21]]
```
but I could also use a dictionary!
```
age_and_name = {"Bob": 12, "Steve":14, "Joe":9, "Mark":21}
```
Dictionaries are surrounded by curly brackets ({}), and each entry is seperated by a comma. The key and value of a dictionary:
```
name_of_dictionary = {key:value, key2:value2}
```
and so on. Keys and Values are seperated by commas. Let's learn what we can do with these useful tools. 
### Using Dictionaries

Just like with the [Using Lists](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-lists) Section, I suggest, if it is your first time, to read through this in its entirety, otherwise, you can use the quicklinks. 
####Functions:
1. [Reading Items from a dictionary](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-dictionaries#reading-items-)
2. [Adding & Updating Items in a Dictionary](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-dictionaries#adding-items-to-a-dictionary)
3. [Removing items using `pop()` and `del`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-dictionaries#removing-items)
4. [`.key` & `.value`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-dictionaries#keys-and-values)
5. [Finding Length using `len()`](https://liamgao.trinket.io/python-basics#/lists-dictionaries-and-tuples/using-dictionaries#finding-length-using-len-)



###Reading Items:
If you remember, each item in a dictionary consists of two parts. A key and a value. We will explore how to get the key and the value if you know the other one.
1. **Getting Value from Key**: Using this method, we can get the value from a key:
```
dictionary_name[key] = value
```
So, for example:
```python.run
my_dict = { 'name': 'Alice', 'age': 25, 'city': 'New York'}
print(my_dict['name'])
```
*Sidenote*: You might notice that I used singe quotes. It does not matter whether single or double quotes. Just DO NOT do this:
```
"bob'
```
When I put in the key, in this case "name", we get the output, in this case, "Alice". 
2. **Getting Key from Value**: Sorry! You can't accually do this straightfowardly. If you want to get into some deeper programming, here is a [Stack Overflow](https://stackoverflow.com/questions/8023306/get-key-by-value-in-dictionary) page to look at. 


###Adding Items to a Dictionary
Again, we have our fun example dictionary. Let's say Alice's e-mail adress is alice123@gmail.com. How can we add that?
```
my_dict['email'] = "alice123@gmail.com"
```
Now, this will add an item with key "email" and value "alice123@gmail.com" to `my_dict`. Now, if I wanted to print `my_dict`, it would result in:
```python
>>> { 'name': 'Alice', 'age': 25, 'city': 'New York', "email":"alice123@gmail.com"}
```
Now, what if we wanted to update Alice's age to 29? Well, you would do the same thing as adding a new item.
```python.run
my_dict = { 'name': 'Alice', 'age': 25, 'city': 'New York'}
my_dict['age'] = 29
print(my_dict)
```
See, Python does all the work for you and finds the key "age" and changes it to 29. 

###Removing Items
You can use roughly the same methods to remove items in dictionary. Let's start with the `del` method:
1. Using the `del` method, you just pu `del` before the name of the list and in the brackets, you put the key for the item that you want to remove. For example, removing `email` from `my_dict` would look like this"
```
del my_dict['email']
```
2. Popping, just like with lists, will remove the the item and also return it. You can do it like this, pretty in the same way
```
my_dict.pop('email')
```
Again, setting this to a variable, the variable will be the deleted item. 

###Keys and Values
1. You can use the `keys()` function to return a list of keys. For example
```python.run
my_dict = { 'name': 'Alice', 'age': 25, 'city': 'New York'}
print(my_dict.keys())
```
2. You can use the `values()` function to return a list of values. For example:
```python.run
my_dict = { 'name': 'Alice', 'age': 25, 'city': 'New York'}
print(my_dict.values())
```

###Finding Length Using `len()`
Just like with lists, you can use the `len()` function to find the length of a dictionary. 
```python.run
my_dict = { 'name': 'Alice', 'age': 25, 'city': 'New York'}
print(len(my_dict))
```
### What’s a Tuple?
A Tuple is basically a list. Pretty stupid, right? Yeah. The only major difference is that you can't edit a tuple. Once it's created, it can't be edited. No deleting, no adding to it. You can only delete the whole thing at once. You can only read items. It's like having a Google Document in "View Mode" instead of "Edit Mode".

Tuples are surrounded by parentheses () but other than that, they follow the same rules of lists. Like previously mentioned, once created , Tuples can not be edited. If you try, this will happen:
```python.run
my_tuple = ("good", "hi", "hello", "world")
my_tuple.append("meow")
```
See, it gives an error because you can not add things to a tuple. To delete the entire tuple, refer to the [Using Lists](https://trinket.io/liamgao/courses/python#/lists-dictionaries-and-tuples/using-lists) section. 
### List Comprehension
List Comprehension is when you create list from a modified set of items; it's basically a mini for-loop in a list. It's better to explain with an example:

*Sidenote:* ** means rasing something to the power of something.
```python.run
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(squared)
```
The general format is:
```
[operator] for [variable] in [list]
```
You can also use an if statement:

*Tip*: Review operators [here](https://trinket.io/liamgao/courses/python#/hello-world/numbers-and-operations)
``` python.run
numbers = [1, 2, 3, 4, 5]
even_or_odd = ["even" if x%2 == 0 else "odd" for x in numbers]
print(even_or_odd)
```
As you can see here, this simple function will label numbers as odd or even. Here, again, is the general format.
```
[Do something] if [condition] for [variable] in [list]
```
What if you have multiple statements you need to chain together? Normally, you would use `elif`, but `elif` is not allowed in list comprehension. Instead, you would use this format (if you are still confused after this, see excersise solution)
```
[Do something] if [condition] else [do different thing] if [different condition]....
```
Try this excerise: Create a list comprehension script to determine if a list of numbers is positive, negative, or equal to 0 (saving the result to a list called `relation_to_zero` and then print the result):
```
numbers = [-2, -1, 0, 1, 2]
```
```python.run
#!/bin/python3
```
*Solution*:
```python.run
numbers = [-2, -1, 0, 1, 2]
relation_to_zero = ["Equal to 0" if x == 0 else "greater than 0" if x > 0 else "less than 0" for x in numbers]
print(relation_to_zero)
```

### Section Practice
Follow the directions to complete the optional practice:

*Important!*: If you put a `#` before your line, it will "comment" out the line. Python ignores these lines. You can use these `#` for anything you like. You will see these as ways I give instructions inside the trinket. These comments are 	<span class="olive">Green</span>. Some common uses for `#` are
* Making notes to yourself
* Providing Instructions to others
* Making some code not run temporarily. 

If you want to comment out a lot, you can:
1. Select the lines you want to comment out
2. Hit Control/Command + / to comment out those lines. To uncomment, follow the same two steps. 

**Directions**: Click the Remix Button* to remix the project. Then, follow the instructions. 

<iframe src='https://trinket.io/embed/python/da3d045e25c5?start=result' width='100%'  height='400' frameborder='0' marginwidth='0' marginheight='0' allowfullscreen></iframe>

*The remix button looks like this: <i class="fa fa-save">

#### Lesson Assets
# 1. Make a list of fruits and print the list. 








# 2. 
# A) Make a dictionary that contains the names a dogs and their breed. Make it so that 
# when the user types in the name, it returns the breed. 









# B) Challenge! Make it so that when they type in a breed, names of dogs from that breed
# are printed. (Hint! Make the keys breed type and the value dog names aka. Flip the 
# dictionary)








# 3. Make a Tuple. What happens when you try and edit it?
## Packages
### What’s a Package?
You might have noticed that the built-in functions of Python are very simple. What if I wanted to draw something? Or choose a random number? Or keep track of time? In this case, you would have to use a package. To use a package, you can import it like so:
```
import time
```
where `time` is the name of the package. This is not the only way to import a package. You can use this keyword if you want to just import one function from the package, but `*`means importing everything from the package:
```
from time import *
```
So, this would do the same thing as the previous. Some packages have to be imported in a special way. You should check their documentation (all packages have a documentation, whether that is on github, pypi, or docs.python.org) to see which one to use. 

You can find different packages by simplily searching with your search engine, but trinket only supports a few of the over 350,000 packages out there 😥. You can see which ones trinket supports [here](https://trinket.io/docs/python).

### Random
Random is a package that does all things random, picking random items from lists, random numbers, ect. I, personally, was really suprised that Python does not have this already built in and has to rely on a package to simplily choose random numbers. 

The package is called `random`. Import it like so:
```
import random  
```
Random has a whole host of functions, but we are going to start with the most simple one. 
```
random.randint()
```
This function will choose a random number. But between which two numbers? This is what we put in the parentheses. For example, if I had `random.randint(3,7)`, it would choose a random number from 3, 4, 5, 6, 7. Notice how 7 is **included** in the list of numbers. Try it out!
```python.run
import random  
```
In this interactive console, you can just use the command, but remember to import the package using `import` before you try to use it in your own code!

What if you want to choose from a list? Let's bring back our list of fruits:
```
fruits = ["apple", "orange", "banana", "strawberry"]
```
We can use `random.choice()`! To use it, simily put the name of the list inside the perentheses. 
```
import random
fruits = ["apple", "orange", "banana", "strawberry"]
random.choice(fruits)
```
We could also set it to variable, and then print the variable or do other things with it. You can also do the same thing (setting it to a variable) with `random.randint()`.
```
import random
fruits = ["apple", "orange", "banana", "strawberry"]
bob = random.choice(fruits)
print(bob)
```
Those are the basic functions of random!
### Time
What I want to time delay some action? Well, I can use the `time` package. We can use `time.sleep()`. This command is very simple. All you have to do is put the amount of seconds you want your program to wait inside the parentheses. For example:
```
import time
print("hello")
time.sleep(2)
print("hello")
```
This will print "hello" once, wait 2 seconds, than print "hello" again. Time also has one other mildly useful function: `time.time()`. All this does is return how many seconds it has been since the Epoch (1/1/1970). Try it out!
```python.run
import time
time.time()
```
Again, as always, you can set `time.time()` as a variable. 
### Turtle
Turtle is a package that allows you to draw and make your project look pretty!

**Creating your turtle**: Create your turtle using the `Turtle()` function. Be sure to import your turtle like this `from turtle import *` and NOT like this `import turtle`. Simply name your turtle and create it like so (your turtle is a variable):
```
from turtle import *
your_name_turtle = Turtle()
```
Turtle has a whole buttload of functions, so get ready! Also, these are basic functions. For more advanced functions, see part 2. 
***
**Movement**: You can use the `turtle.forward()` and `turtle.backwards` function to move your turtle left and right. Put the distance you want your turtle to move in the parentheses. By defualt, your turtle's "pen" is down, so it can draw. For example, if you want your turtle named `bob` to go forwards by 100, do this:
```
bob.forward(100)
```
Try it out!
```python.run
from turtle import *
bob = Turtle()
bob.forward(100)
```
***
**Turning**: Use the `turtle.left()` and `turtle.right()` fuctions to turn left and right. Put the degrees of turn inside the parentheses. For example, if you wanted your turtle named bob to turn right 90 degress:
```
bob.right(90)
```
Try it out!
```python.run
from turtle import *
bob = Turtle()
bob.forward(100)
bob.right(90)
bob.forward(100)
```
Can you make `bob` make a square?
***
**Pen Up & Pen Down**: This will make your turtle lift its imaginary pen up. This means your turtle can still move around, but it won't draw wherever it goes. If you have a turtle named bob: 
```python.run
from turtle import *
bob = Turtle()
bob.forward(100)
bob.right(90)
bob.penup()
bob.forward(100)
bob.right(90)
bob.pendown()
bob.forward(100)
```
***
**Color**: To make your turtle change color, use `turtle.color()`. Put the name of the color inside the parentheses. You can use rbg too. Here is an example with a turtle named bob. 
```python.run
from turtle import *
bob = Turtle()
bob.color(255,0,255)
bob.forward(100)
bob.right(90)
bob.penup()
bob.forward(100)
bob.right(90)
bob.pendown()
bob.forward(100)
```
***
**Speed**: Make your turtle go faster! Put the speed of the turtle inside the parentheses, but watch out! It does not go the way you think it does:
* ‘fastest’ :  0
* ‘fast’    :  10
* ‘normal’  :  6
* 'slow’    :  3
* 'slowest’ :  1

Here is an example with a turtle with a turtle named bob going at speed 1:
```python.run
from turtle import *
bob = Turtle()
bob.color(255,0,255)
bob.speed(1)
bob.forward(100)
bob.right(90)
bob.penup()
bob.forward(100)
bob.right(90)
bob.pendown()
bob.forward(100)
```
***
**Shape**: Use the `turtle.shape()` function to change the look of your turle from the defualt icon. Lets make our turtle called bob look like an accual turtle by saying `bob.shape("turtle")`:
```python.run
from turtle import *
bob = Turtle()
bob.color(255,0,255)
bob.shape("turtle")
bob.speed(1)
bob.forward(100)
bob.right(90)
bob.penup()
bob.forward(100)
bob.right(90)
bob.pendown()
bob.forward(100)
```
***
**Background:** Set your background as a color using the `.bg()` function.
This needs is bit more work. You will have to create another turtle, but instead of setting it to `Turtle()`, you will set it to `Screen()`. You can think of this If my turtle is named bob, and I want to set the color to 0,255,0, I can do it this way (you can also set bg to images, but we'll learn how to do that later. )
```python.run
from turtle import *
steve = Screen()
bob = Turtle()
steve.bgcolor(0,255,0)
bob.color(255,0,255)
bob.shape("turtle")
bob.speed(1)
bob.forward(100)
bob.right(90)
bob.penup()
bob.forward(100)
bob.right(90)
bob.pendown()
bob.forward(100)
```
### Turtle II
###More turtle functions!
***
**Images**: This is the most complicated turtle function. Most code editors do it differently, but this is how we do it in trinket. Watch the video to learn how to put an image into your trinket project and then we'll learn how to display it. 

*Sidenote:* The reason that we use GIF format is because that is the only format the Turtle supports. 

![video](https://vimeo.com/1056476068?share=copy)

Now, we can use this image. If our image is named "earth.gif", and we have a turtle named bob, than, to display it, we can use the following functions. There are accually two different things you can do with images. 
1. **Set it as your image as your background.** You can do this by making a turtle.screen turtle and then setting the image as the bg (this is accually a bit hard to show, so paste this into the project where your image is):
```
from turtle import *
screen = Screen()
screen.bgpic("yourfilenamehere.gif")
```
Now, you might notice that it only displays part of your image and the other parts get cropped out. Don't worry, this is easily fixable. Use the `setup` function to change the dimentions of your window where x and y are the dimentions of your window in pixels:
```
from turtle import *
screen = Screen()
screen.setup(x, y)
```
The trinket output window might not be big enough to display the whole image, so you can use the scroll wheels to pan the image.
2. **Set it as your turtle**. Remember how we made our turtle an accual turtle in the previous section? Well, you can also make your turtle an image. We still need a `screen` turtle:
```
from turtle import *
screen = Screen()
```
Next, we need to let python know that we want to use the image with the `addshape()` function:
```
screen.addshape("nameofgifhere.gif")
```
Next, we can create our turtle:
```
bob = Turtle()
bob.shape("nameofgifhere.gif")
``` 
***
**Text:** You can use the`write` function in order to put text on the screen. The write function works like this:
```
pen.write("Hello, Turtle!", align="center", font=("Arial", 16, "normal"))
```
Let's see what each part does:
1. **"Hello Turtle"** This is what you want to write
2. **align="center"** This part tells the computer whether you want your text aligned left, center, or right
3. **font=("Arial", 16, "normal")**: This part tells the computer the font is Arial, the font size is 16 and its normal (not bold italisised, or underlined)
***
You are all set!
There are many more functions, but there isn't time to cover them all. You can look at the turtle documentations online to familarize yourself with all the functions. 
### Section Challenge/Extra
Of course, I have no time to cover all the packages there are in the world. You can use documentations (see first section of "Packages") to learn about different types of packages. Most of the time, there will be a package for anything you want. Fetching data from web pages, creating games, and UI. Anything!

Your section challenge this time has two parts: Projects and Questions. Here is part 1: Project. As always, create your own trinket (review how [here](https://liamgao.trinket.io/python-basics#/welcome/create-your-first-trinket).)
****
**PROJECT CHALLENGE!** Your challenge is to use the `time` package (review that [here](https://liamgao.trinket.io/python-basics#/packages/time)) to create a clock that tells you the time. Make it tell you the time every 10 seconds. Use math to convert the time in seconds since the Epotch to a human readable time! Extra Challenge: Use Turtle to make your clock fancy!

****
**QUESTION CHALLENGE!** Complete the question challenge (3 questions) below by clicking the run ▶ button. 

<iframe src="https://trinket.io/embed/python/cbaf7c37e1fc?outputOnly=true&runOption=run" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>

#### Lesson Assets
#!/bin/python3
questionswrong = []
print("This question challenge has 5 questions")
def question(question, answer, answer2, questionnum, questionswrong):
  questionblah = input(question)
  if questionblah == answer or questionblah == answer2:
    print("Correct")
  else:
    stuff = "Question " + str(questionnum)
    questionswrong.append(stuff)
    print("Incorrect")
question("Question 1: How can I import a package called bob? Write the command and nothing else.", "import bob", "import bob", 1,questionswrong)
question("Question 2: If I want to choose a random number between 5 and 28, how would I do that? Write the command to do so and nothing else.", "random.randint(5, 28)", "random.randint(5,28)", 2, questionswrong)
question("Question 3: If I want to make my program wait 10 seconds, how can I do that. Enter the command and nothing else.", "time.sleep(10)", "time.sleep(10)", 3, questionswrong)
question("Question 4: If I have a list called people, how can I choose a random item from that list. Enter the command and nothing else.", "random.choice(people)", "random.choice(people)", 4, questionswrong)
question("Question 5: How can I make my turtle move forwards 5 using turle?", "turtle.foward(5)", "turtle.foward(5)", 5, questionswrong)

## PROJECT 2: Rock, Paper, Scissors
### Rock, Paper, Scissors Part 1
Let's make our second project! Rock, paper, scissors. Lets take a look at the things our project will need to have in order to be fun:
* The computer should make random moves that you can play against
* The player should be able to choose their move
* The computer should be able to tell you who wins. 

Those are the three main goals. Let's take them step-by-step. Before we get started though, have a play at what we are going to make:

```python.run.hidden
import random
options = ["rock", "paper", "scissors"]
for x in options:
  print(x)
playagain = "y"
score = 0
while playagain.strip().lower() == "y":
  user = input("Choose one (rock, paper, or scissors): ")
  user = user.strip().lower()
  while user not in options:
    print("Pick rock, paper, or scissors.")
    user = input()
    user = user.strip().lower()
  bot = random.choice(options)
  print("computer chose", bot)
  outcome = [user, bot]
  playerWins = [["rock", "scissors"], ["scissors", "paper"], ["paper", "rock"]]
  if outcome in playerWins:
    print("You win")
    score += 1
    print("your score is", score)
  elif user == bot:
    print("You tie")
  else:
    print("computer wins")
  playagain = input("Play again? (y/n): ")
    
# if user == bot:
#   print("Tie")
# elif user == "rock" and bot == "scissors":
#   print("You win")
# elif user == "paper" and bot == "rock":
#   print("You win")
# elif user == "scissors" and bot == "paper":
#   print("You win")
# else:
#   print("computer wins")
```

First, create a new trinket project (review how to do that [here](https://trinket.io/liamgao/courses/python-basics#/welcome/create-your-first-trinket)). We should start first by asking the user what they want to pick (rock, paper or scissors). Let's also tell them the options by printing them, just in case they are not already familar with rock, paper scissors. When run, your code should look something like this:
```python
>>> Rock
... Paper
... Scissors
... Choose one: 
```
Let's also save the users input as a variable (anytime during this project, if you don't just want the answers, but you don't know what to do, consult back at the other lessons. You've already learned everything needed to make this project!). Your code should look like this:
```
print("rock, paper scissors")
user = input("Choose one: ")
```
Ok, now that we have the users choice, let's program the computer's random choice. First, when we want to choose something random, we have to use the `random` package. Let's import the package first. Add this line to the top of your code:
```
import random
```
Now, we have to have it choose rock paper or scissors and save the computers random choice as a variable. See if you can do that yourself first. 

In order to do this, we can create a list with the three choices (rock, paper scissors) in it, and have the computer choose a random one from the list using `random.choice()`. Your code, with the additon, should look like this now:
```
print("rock, paper scissors")
user = input("Choose one: ")
options = ["rock", "paper", "scissors"]
bot = random.choice(choices)
```
Lets just add one line of code to make sure we know what the computer chose. 
```
print("computer chose", bot)
```
One more thing. We want to make sure that the user does not choose something that is not rock, paper or scissors. Let's add a check to make sure the user chooses one of the three options (this is called dummy proofing in programming). We can do this by detecing if the user's answer is in the choices list. 
```
if user not in choices:
    user = input("Please try again")
```
Now that we have both the user and the computer's choice, we need to determine who wins. Click the > in the top right corner to progress to part 2. 

P.S. Stand up, take a drink of water, go to the bathroom for 5 minutes before you continue to give your eyes a break! 🙂



### Rock, Paper, Scissors Part II
Now that we know both the computer and the user's choice, we need to decide who wins. If you recall, we can use if loops to tell us what happened and give a response accordingly. Let's set up the first if loop together and see if you can do the rest on your own. To make it simple, we have 4 cases to consider:
1. User beats computer rock to scissors
2. User beats computer scissors to paper
3. User beats computer paper to rock
4. User and computer tie

Well now, you might be wondering, "where are the cases where the computer wins?", well, if all four cases are a "no", it means the computer has won. Let's code the first example together. 
```
if user == "rock" and bot == "scissors":
   print("User Won")
```
Can you try and write the remaining statements? 

It should look like this:
```
elif user == "paper" and bot == "rock":
  print("You win")
elif user == "scissors" and bot == "paper":
   print("You win")
elif user == bot:
    print("Its a tie!")
```
Now, all the other cases will be a computer victory, so simply add an else statement to the end of the if loops like this:
```
else:
    print("Computer Wins!")
```
Just one final touch. Let's make it so that the user doesn't have to click the run button every time they want to play again. We can create a simple `input()` that will ask the user to play again. Add this to the end of your code:
```
play_again = input("Do you want to play again (y or n)?")
```
Now, surrond the part of the code starting where you ask the user for input with a while loop. 
```
while play_again == "y":
    user = input("What do you choose")
    ...
```
Also, don't forget to set play_again to "y" at the beginning, so your code does not immediatly terminate. 
```
play_again = "y"
```
Your entire code should look something like this:
```
import random
options = ["rock", "paper", "scissors"]
play_again = "y"
while play_again.strip().lower() == "y":
    print("rock, paper, scissors, choose one")
    user = input("Choose one: ").strip().lower()
    while user not in options:
        print("Please Choose an option")
        user = input("Choose one: ").strip().lower()
    bot = random.choice(options)
    print("computer chose", bot)
    if user == bot:
        print("Tie")
    elif user == "rock" and bot == "scissors":
      print("You win")
    elif user == "paper" and bot == "rock":
      print("You win")
    elif user == "scissors" and bot == "paper":
      print("You win")
    else:
      print("computer wins")
    play_again = input("play again? (y for yes, n for no): ")
```
Try it and see if everything works out! If it doesn't work, go and submit a "need help" on the form in the Welcome section. 

### Optimizing our Rock, Paper, Scissors
You might think right now that our rock, papar, scissors is not very efficent because we have all those if loops. Me too. We can optimize our code using 2D lists. If you don't remember what those are, you should go review them first [here](https://trinket.io/liamgao/courses/python#/lists-dictionaries-and-tuples/2d-lists)

*Sidenote: Before starting, comment out (or delete) the previous if statements. Review commenting [here](https://trinket.io/liamgao/courses/python#/lists-dictionaries-and-tuples/section-practice)*
***
First, we can make a 2D list that has all of the different cases where the player would win (add this to the top of your code, where we set all the variables).
```
player_wins = [["rock", "scissors"], ["scissors", "paper"], ["paper", "rock"]]
```
Ok. Now that we have a list of all the possible player win scenarios, we can check if the current scenario is in the list of player wins scenarios. If it is, than the player wins, if it isn't, than the computer wins. Before we do that however, we need to make the current scenario into a list like the ones we see in the 2D list (in the format `[player, bot]`). We can do this simply:
```
current = [player, bot]
```
*Sidenote: We are using the player and bot variable from earlier. If you didn't complete the "rock, paper, scissors parts 1 and 2, you should go do that first.*

Now that we have everything set up, try writing the code for the if statement yourself before looking below. 

Ok, the code for the if statement is:
```
if current in player_wins:
    print("Player Won!")
```
After this, we only need to check for ties and the computer winning. Let's do ties first. 
```
elif player == bot:
    print("It's a tie!")
```
Now, the bot winning is pretty simple, because think about it, there are only three cases in rock, paper, scissors. 
1. The player wins
2. The bot wins
3. They tie

So, if we have already checked for the player winning and the tie, then the only other case will be the bot winning, so a simple else statement should do the job. 
```
else:
    print("The bot won.")
```
****
Together, your final revised code should look like this:
```
...
player_wins = [["rock", "scissors"], ["scissors", "paper"], ["paper", "rock"]]
...
current = [player, bot]
if current in player_wins:
    print("Player Won!")
elif player == bot:
    print("It's a tie!")
else:
    print("The bot won.")
```
Try it out and see if it works! 😀

## Functions
### Create Your Own Functions!
Ok. This section is about functions. You might have noticed we didn't start with a "What's a function?" section. That's because you've already used functions before, and you probably didn't even know it. Here are a few examples:
1. print("Hello World")
2. input("What's your name?")
****
You can also create your own functions. Using the `def` keyword, I can create a function. For example:
```
def say_hi():
    name = "Bob"
    print("Hello,", name)
```
To call these functions, just type the name followed by parenthesis. Try the example below:
```python.run
#!/bin/python3
def say_hi():
    name = "Bob"
    print(f"Hello, {name}")
#Call the function
say_hi()
```
These functions can pretty much do whatever you want. But what if I want a result from the function? Then I can use the `return` keyword. For example:
```
def bark():
    return “bark!” ```
Now, if I want to use the result from the function:
```
```python.run
def bark():
    return “bark!”
dog = bark()
print(dog)
```

### Parameters
Sometimes, when you want to call a function, you need to give it value(s) to manipulate. You can do this by adding parameters to your functions. Here's a simple example:
```
def add(num1, num2):
    return num1+num2
```
Now, if I do `add(1, 1)`, see what it does. 
```python.run
def add(num1, num2):
    return num1+num2
sum = add(1, 1)
print(sum)
```
Parameters can be basically anything you want! Strings, numbers, list, etc. What if I forget to include a parameter?
```python.run
def add(num1, num2):
    return num1+num2
sum = add(1)
print(sum)
```
You get an error! 
**Important!** Make sure you include all parameters specified (unless you have defualt parameters (see below)) and make sure you include them in the right order! For example, I can make a function to concatenate two strings:
```
def concatenate(string1, string2):
    return f"{string1} {string2}
```
Now, we can see that `concatenate("apple", "orange")` is different from `concatenate("orange", "apple")`.
****
You can also set default parameters. That way, if a user does not include a parameter, it will defualt to something. Let's edit our `add` function:
```
def add(num1, num2=1):
    return num1 + num2
```
Now, if we don't include num2, it will defualt to 1:
```python.run
def add(num1, num2=1):
    return num1+num2
sum = add(3)
print(sum)
```
***
Practice: Create a function that returns "greater than 0", "equal to 0", or "less than 0" based on what you input. If the user does not provide a value, the defualt should be 1. 

*Solution:*
```
def tozero(num=1):
    if num > 0:
        return "greater than 0"
    elif num == 0:
        return "equal to 0"
    else:
        return "less than 0"
```
## Text Files and CSVs
### Viewing Demos with Text Files
In the interactive examples below, use the **+ File** control to create a `.txt` or `.py` file. Select a file tab to edit it. The files are available to the Python program when you press **Run**.
### Reading From a Text File
Using Python, you can read info from text files. This is useful when you have large amounts of data or you want to seperate your data from your code in order to change the data more easily. 
***
<h4>Text File Syntax</h4>

If we have a demofile called demofile.txt:
```
Hello World! This is the demo file!
```
In order to read files, you need to use this format:
```
with open("demofile.txt", "r") as f:
    ...
```
Let's go through this step by step. First, we use the `with` keyword to open the file. Next, the we use the `open()` function. The first parameter of the open function is the name of the file you want to open, and the second parameter of the open function is what you want to do with the file (the mode). These are the options:
* `r`: Read mode - Opens the file for reading
* `w`: Write mode - Opens the file for writing (we will talk about this more in the next section)
* `a`: Append mode - Writes data to the end of the file
* `x`: Exclusive Creation Mode: Creates a new file and opens it for writing. Fails if the file already exists. 
* `r+`: Read+ - Opens the file for reading and writing. Returns a `FileNotFound` error if the file does not already exist.
* `w+`: Write+ - Opens the file for reading and writing. Creates a new file if file is not found. 

In this section, we are going to focus on the reading function. 

The `as f` part of the statement above simply gives the file a name that we can use to refer to it in the program. It is basically a variable and can be anything you want. I am just using `f` as an example here. 
***
There are two main functions that you can use to read files: `read()` and `readlines()`. 
The `read()` command reads the entire file into a string. Here's an example. Use the file tabs to edit `demofile.txt`, add other files, or change the Python code:
```file:demofile.txt
Hello World! This is the demo file!
```
```python.run
with open("demofile.txt", "r") as f:
    filetext = f.read()
print(filetext)
```
The `readlines` function reads the file by lines into a list of strings, with one string being each line, and a new line character (`\n`) at the end of each line. Let's modify the demo file to showcase this function:
 
`demofile.txt`
```
Hello World!
This is a demo file!
This is a new line.
```

```file:demofile.txt
Hello World!
This is a demo file!
This is a new line.
```
```python.run
with open("demofile.txt", "r") as f:
    myfile = f.readlines()
print(myfile)
```
#### Lesson Assets

https://trinket.io/embed/python/279a8f6125f9?start=result 
main.py
#!/bin/python3
with open("demofile.txt", "r") as f:
  filetext = f.read()
print(filetext)
Demofile.txt
Hello World! This is a demo file!

https://trinket.io/embed/python/f3ffa189b900?start=result 
main.py
#!/bin/python3
with open("demofile.txt", "r") as f:
  myfile = f.readlines()
print(myfile)
Demofile.txt
Hello World!
This is a demo file!
This is a new line.
### Writing Data Into a Text File
In order to write to files, we need to make use of the other 3 functions of the `open()`: `a, w, x`. 
***
1. Write - `w`. There are two uses to this:

a. Create new file and open it for editing: If you input a file where the filename goes and it doesn't exist, the `open()` function automatically creates a new file. Say I have a blank project with only a hello.py file in it:
```
with open("demofile.txt", "w"):
    ...
```
If a `demofile.txt` already exists in the project, when you open it with the write function, instead of creating a new doc, it will open the existing file for editing. 



Now, this would automatially create a `demofile.txt` file, and open it for writing. There are two functions for writing, `write()` and `writelines()`. 
### CSV (Comma Seperated Lists) - INCOMPLETE
### Challenge/Mini-Project - INCOMPLETE
## PROJECT 3: Hangman
### Hangman I - Logic
Welcome to your third (and last *official*) project of this course! For our hangman game to function, we need:
* A list of words to play Hangman with
* Randomly select a word
* Logic to process guessed letters and see if they are in the word
* Turtle logic in order to draw the "Hangman"

In Part I of this project, we are going to be focusing on the logic part of hangman, and in Part II, we are going to be focusing on the drawing the Hangman, which can be a bit tedious. 

As always, before we begin, here is the finished product:
Run the hidden-code activity below and enter letters in the console. The `words.txt` tab contains the word list; you can edit it or add other project files.
```file:words.txt
python
hangman
programming
computer
keyboard
```
```python.run.hidden
import random
import turtle

with open("words.txt", "r") as word_file:
    words = [line.strip().lower() for line in word_file if line.strip()]
if not words:
    raise ValueError("Add at least one word to words.txt.")

word = random.choice(words)
revealed = ["_" for _ in word]
guessed = set()
wrong_guesses = 0

screen = turtle.Screen()
screen.setup(400, 400)
pen = turtle.Turtle()
pen.speed(0)
pen.hideturtle()
pen.pensize(4)

pen.penup()
pen.goto(-130, -140)
pen.pendown()
pen.forward(220)
pen.backward(110)
pen.left(90)
pen.forward(250)
pen.right(90)
pen.forward(110)
pen.right(90)
pen.forward(35)
pen.penup()

def draw_part(number):
    if number == 1:
        pen.goto(0, 55)
        pen.pendown()
        pen.circle(20)
        pen.penup()
    else:
        start_end = {
            2: ((0, 15), (0, -55)),
            3: ((0, -5), (-30, -35)),
            4: ((0, -5), (30, -35)),
            5: ((0, -55), (-25, -100)),
            6: ((0, -55), (25, -100)),
        }
        start, end = start_end[number]
        pen.goto(*start)
        pen.pendown()
        pen.goto(*end)
        pen.penup()

print(" ".join(revealed))
while "_" in revealed and wrong_guesses < 6:
    guess = input("Guess a letter: ")
    guess = guess.strip().lower()
    if len(guess) != 1 or not guess.isalpha():
        print("Enter one letter.")
        continue
    if guess in guessed:
        print("You already guessed that letter.")
        continue
    guessed.add(guess)
    if guess in word:
        for index, letter in enumerate(word):
            if letter == guess:
                revealed[index] = guess
        print("Correct!", " ".join(revealed))
    else:
        wrong_guesses += 1
        draw_part(wrong_guesses)
        print("Not in the word.", " ".join(revealed))

if "_" not in revealed:
    print("You won!")
else:
    print("You lost! The word was", word)
```

First, create a new trinket. You can review that [here](https://trinket.io/liamgao/courses/python#/welcome/create-your-first-trinket). Make sure to add `#!/bin/python3` to beginning of the code, to tell trinket to use Python 3. Next, we need to get the list of words to choose from. An effective way to store that data would be in a text file. Create a text file called `words.txt` (review how to do that [here](https://trinket.io/liamgao/courses/python#/text-files-and-csvs/creating-a-text-file-in-trinket)), and paste the following words into the text file named `words.txt`
(feel free to remove words that seem to hard or easy):
```
abruptly
absurd
abyss
affix
askew
avenue
awkward
axiom
azure
bagpipes
bandwagon
banjo
bayou
beekeeper
bikini
blitz
blizzard
boggle
bookworm
boxcar
boxful
buckaroo
buffalo
buffoon
buxom
buzzard
buzzing
buzzwords
caliph
cobweb
cockiness
croquet
crypt
curacao
cycle
daiquiri
dirndl
disavow
dizzying
duplex
dwarves
embezzle
equip
espionage
euouae
exodus
faking
fishhook
fixable
fjord
flapjack
flopping
fluffiness
flyby
foxglove
frazzled
frizzled
fuchsia
funny
gabby
galaxy
galvanize
gazebo
giaour
gizmo
glowworm
glyph
gnarly
gnostic
gossip
grogginess
haiku
haphazard
hyphen
iatrogenic
icebox
injury
ivory
ivy
jackpot
jaundice
jawbreaker
jaywalk
jazziest
jazzy
jelly
jigsaw
jinx
jiujitsu
jockey
jogging
joking
jovial
joyful
juicy
jukebox
jumbo
kayak
kazoo
keyhole
khaki
kilobyte
kiosk
kitsch
kiwifruit
klutz
knapsack
larynx
lengths
lucky
luxury
lymph
marquis
matrix
megahertz
microwave
mnemonic
mystify
naphtha
nightclub
nowadays
numbskull
nymph
onyx
ovary
oxidize
oxygen
pajama
peekaboo
phlegm
pixel
pizazz
pneumonia
polka
pshaw
psyche
puppy
puzzling
quartz
queue
quips
quixotic
quiz
quizzes
quorum
razzmatazz
rhubarb
rhythm
rickshaw
schnapps
scratch
shiv
snazzy
sphinx
spritz
squawk
staff
strength
strengths
stretch
stronghold
stymied
subway
swivel
syndrome
thriftless
thumbscrew
topaz
transcript
transgress
transplant
triphthong
twelfth
twelfths
unknown
unworthy
unzip
uptown
vaporize
vixen
vodka
voodoo
vortex
voyeurism
walkway
waltz
wave
wavy
waxy
wellspring
wheezy
whiskey
whizzing
whomever
wimpy
witchcraft
wizard
woozy
wristwatch
wyvern
xylophone
yachtsman
yippee
yoked
youthful
yummy
zephyr
zigzag
zigzagging
zilch
zipper
zodiac
```
OK. Now that we have all the words, the first thing we need to do is to read the words into the program. Try to attempt this yourself before reading on. We can use thw `open()` function to open the file for reading like this:
```
with open('words.txt', 'r') as w:
    words = w.readlines()
```
But wait! We're not done! As you might recall, readline adds a new line symbol (`\n`) to the end of each line. We can use the "strip" function to remove them, iterating though each line using [list comprehension (click to review)](https://trinket.io/liamgao/courses/python#/lists-dictionaries-and-tuples/list-comprehension). 
```
with open("words.txt", "r") as w:
    words = [word.strip() for word in w.readlines()]
```
Ok. Now that we have all our words stored in a list called words, we have to select a random one. We can do that using the `random.choice()` function from the `random` package. Add an import statement to the top of your code:
```
import random
```
and after we get the words from the text file, lets create a variable
```
hangman_word = random.choice(words)
```
Now, we need a list to store which letters have been revealed. Lets call it `revealed_letters`. Again, we can use list comprehension to quickly create a list with the correct amount of `_` based on how many letters are in the word:
```
revealed_letters = ["_" for letter in hangman_word]
```
Next, we also want a list of words that the user has guessed, to prevent us counting duplicate guesses as wrong. 
```
guessed_letters = []
```
The last part of the setup is going be defining a variable called `body_parts`. We are going to use this variable to determine how many wrong guesses the user has guessed, and which body part for the turtle to draw when the user has guessed wrong. 
```
body_parts = 0
```
*Sidenote:* This might work backwards from the way you expected. This is how many wrong geusses the user has (you could use `len()` to determine the length of the `guessed_letters` list, but it is easier just to use a different variable)

Let's get into the real logic now. Just for the first time, let's print out the revealed_letters list in order to show the user how many letters there are in the word:
```
print(" ".join(revealed_letters))
```
the `.join()` function converts the `revealed_letters` list into a string seperated by spaces (you can also seperate them with any other string, just replace the " " at the beginning with the character that you want).

Now for the main *game loop*. Lets use a `while True` loop. We will break out of the loop when using the `break` keyword when the user has either won or lost. Add the loop to your code, and don't forget to indent the code inside the loop! Inside the loop, the first thing we should do is ask the user what the letter they want to choose. We can do this with an `input()` function:
```
while True:
    guess = input("Guess a letter: ")
```
Next, we want to make sure that they haven't already guessed this letter. We can do this with an if statement:
```
while True:
    guess = input("Guess a letter: ")
    if guess not in guessed_letters:
        ...
```
(I'm gonna stop writing the `while True` now. Everything goes inside the `while True` loop from this point on unless otherwise specified.)

Inside the if statement, the first thing we are going to want to do is add the current guess to `guessed_letters`. 
```
if guess not in guessed_letters:
    guessed_letters.append(guess)
```
Now, the second step is going to be to check if the letter guessed is in the word. We can do this using a simple `if guess in word` if statement. If the user guesses correct, the first thing we should do is print "Correct!"
```
if guess not in guessed_letters:
    guessed_letters.append(guess)
    if guess in word:
        print("Correct!")
```
Next, we want to print out the blanks, with the correct letters filled in. We can do this using a new `enumerate()` function, which can cycle through something like a list, or in our case, a string, and return the index of the current letter/item and also the value. Here's a simple example that reads a word from a project text file:
```file:words.txt
python
hangman
```
```python.run
#!/bin/python3
with open("words.txt", "r") as words_file:
    mystring = words_file.readline().strip()
for i, value in enumerate(mystring):
    print(i, ":", value)
```
<table>
<tr>
<td>
**Remember!** Python starts counting from 0 instead of 1, so it goes: 0, 1, 2, 3, etc.
</td>
</tr>
</table>
Let's use our newfound knowledge:
```
...
if guess in word:
    print("Correct!")
    for i, letter in enumerate(word):
        if letter == guess:
            revealed_letters[i] = guess
```
Here, we enumerate through each item of the word, and see if the letter is the one we guessed. If so, we update the correct list item in our `revealed_letters` list to have the guessed letters. Now that the list is updated, we want to accually print it. We can do this using the same statement from above:
```
... 
        if letter == guess:
            revealed_letters[1] = guess
    print(" ".join(revealed_letters)
```
Be careful about the indentation! We want the `print` statement outside the for loop, so it only executes once. We also need one more check. Below the print statement, we need to check if there are any more "_" left in `revealed_letters`. If not, that means the user has sucessfully won, and we should notify them of that and stop the program:
```
print(" ".join(revealed_letters)
if "_" not in revealed_letters:
    print("You Won!")
    break
```
The `break` keyword breaks us out of the `while True` loop and stops the program. 
***
Remember that big `if guess in word` statement? All of the code above should be inside that statement. Now, let's tackle the other condition: if the user guesses wrong. Now, on the same indentation level as the `if guess in word` statement, add an `else:`. Remember! The only case possible here is that the user has not guessed this letter before, but it is not in the word. Look back in our program if you don't understand why!
```
...
    break
else:
    print("Oops! Letter is not in the word!")
    if guess not in guessed_letters:
        guessed_letters.append(guess)
```
We print a statement saying that the letter is not in the word, and we append the current guess to our `guessed_letters` list. Even if the letter is not in the word, we should also print the current state of the word again:
```
...
if guess not in guessed_letters:
    guessed_letters.append(guess)
print(" ".join(revealed_letters))
```
Lastly, we should add an else statement corrisponding in to the `if guess not in guessed_letters`. This part of the statement will run if the user guesses a letter that has already been guessed. Below the print, on the **same indentation level as is `if guess not in guessed_letters`**, we should add this:
```
else:
    print("You have already guessed this letter! Letters already guessed:", " ".join(guessed_letters))
```
This print statement informs the user that they have guessed a letter that they have already guessed, and also tells them all the letters that they have guessed. 
***
You did it! You made it to the end of Part I of the Hangman game! This is all the logic complete! In the next part, we are going to start working on the `turtle` element of the game to draw the Hangman. Remember to stand up and not look at the computer for a while to give your eyes and brain a break! Debugging tips below! ⬇
***
**FINAL CODE** Please! Don't just copy and paste this into your editor. You should go through the tutorial, understanding each part of the code. If you have bugs, try to *read* the error message and debug your code. **If you scroll past this, you will see some common errors, and how to fix them**. Make sure you understand how to fix the bugs, and more importantly, (I can't count how many times I've stressed this) to ***READ*** the error message and ***Understand*** it!!!! 
```
#!/bin/python3
import random
with open("words.txt", "r") as w:
    words = [word.strip() for word in w.readlines()]
hangman_word = random.choice(words)
revealed_letters = ["_" for letter in hangman_word]
guessed_letters = []
body_parts = 0
print(" ".join(revealed_letters))
while True:
  guess = input("Guess a letter: ")
  if guess not in guessed_letters:
    guessed_letters.append(guess)
    if guess in word:
      print("Correct!")
      for i, letter in enumerate(word):
          if letter == guess:
              revealed_letters[i] = guess
      print(" ".join(revealed_letters))
      if "_" not in revealed_letters:
        print("You Won!")
        break
      else:
        print("Oops! Letter is not in the word!")
        if guess not in guessed_letters:
            guessed_letters.append(guess)
        print(" ".join(revealed_letters))
```
***
**Common Bugs:** 
1. `IndentationError: unindent does not match any outer indentation level on line [x]  in main.py`. This means that your indentation is wrong. Please double check your indentation!!!

#### Lesson Assets
Final Code
#!/bin/python3
import turtle
import random
import time
# Set up the turtle and draw the hang
sc = turtle.Screen()
sc.setup(400, 400)
# sc.title("Hangman")
# Draw the "hang"
t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.left(90)
t.pendown()
t.forward(100)
t.right(90)
t.forward(50)
t.right(90)
t.forward(20)
body_parts=0
#Got some new hangman words(takes up a lot of space)
words = [
             "abruptly",
             "absurd",
             "abyss",
             "affix",
             "askew",
             "avenue",
             "awkward",
             "axiom",
             "azure",
             "bagpipes",
             "bandwagon",
             "banjo",
             "bayou",
             "beekeeper",
             "bikini",
             "blitz",
             "blizzard",
             "boggle",
             "bookworm",
             "boxcar",
             "boxful",
             "buckaroo",
             "buffalo",
             "buffoon",
             "buxom",
             "buzzard",
             "buzzing",
             "buzzwords",
             "caliph",
             "cobweb",
             "cockiness",
             "croquet",
             "crypt",
             "curacao",
             "cycle",
             "daiquiri",
             "dirndl",
             "disavow",
             "dizzying",
             "duplex",
             "dwarves",
             "embezzle",
             "equip",
             "espionage",
             "euouae",
             "exodus",
             "faking",
             "fishhook",
             "fixable",
             "fjord",
             "flapjack",
             "flopping",
             "fluffiness",
             "flyby",
             "foxglove",
             "frazzled",
             "frizzled",
             "fuchsia",
             "funny",
             "gabby",
             "galaxy",
             "galvanize",
             "gazebo",
             "giaour",
             "gizmo",
             "glowworm",
             "glyph",
             "gnarly",
             "gnostic",
             "gossip",
             "grogginess",
             "haiku",
             "haphazard",
             "hyphen",
             "iatrogenic",
             "icebox",
             "injury",
             "ivory",
             "ivy",
             "jackpot",
             "jaundice",
             "jawbreaker",
             "jaywalk",
             "jazziest",
             "jazzy",
             "jelly",
             "jigsaw",
             "jinx",
             "jiujitsu",
             "jockey",
             "jogging",
             "joking",
             "jovial",
             "joyful",
             "juicy",
             "jukebox",
             "jumbo",
             "kayak",
             "kazoo",
             "keyhole",
             "khaki",
             "kilobyte",
             "kiosk",
             "kitsch",
             "kiwifruit",
             "klutz",
             "knapsack",
             "larynx",
             "lengths",
             "lucky",
             "luxury",
             "lymph",
             "marquis",
             "matrix",
             "megahertz",
             "microwave",
             "mnemonic",
             "mystify",
             "naphtha",
             "nightclub",
             "nowadays",
             "numbskull",
             "nymph",
             "onyx",
             "ovary",
             "oxidize",
             "oxygen",
             "pajama",
             "peekaboo",
             "phlegm",
             "pixel",
             "pizazz",
             "pneumonia",
             "polka",
             "pshaw",
             "psyche",
             "puppy",
             "puzzling",
             "quartz",
             "queue",
             "quips",
             "quixotic",
             "quiz",
             "quizzes",
             "quorum",
             "razzmatazz",
             "rhubarb",
             "rhythm",
             "rickshaw",
             "schnapps",
             "scratch",
             "shiv",
             "snazzy",
             "sphinx",
             "spritz",
             "squawk",
             "staff",
             "strength",
             "strengths",
             "stretch",
             "stronghold",
             "stymied",
             "subway",
             "swivel",
             "syndrome",
             "thriftless",
             "thumbscrew",
             "topaz",
             "transcript",
             "transgress",
             "transplant",
             "triphthong",
             "twelfth",
             "twelfths",
             "unknown",
             "unworthy",
             "unzip",
             "uptown",
             "vaporize",
             "vixen",
             "vodka",
             "voodoo",
             "vortex",
             "voyeurism",
             "walkway",
             "waltz",
             "wave",
             "wavy",
             "waxy",
             "wellspring",
             "wheezy",
             "whiskey",
             "whizzing",
             "whomever",
             "wimpy",
             "witchcraft",
             "wizard",
             "woozy",
             "wristwatch",
             "wyvern",
             "xylophone",
             "yachtsman",
             "yippee",
             "yoked",
             "youthful",
             "yummy",
             "zephyr",
             "zigzag",
             "zigzagging",
             "zilch",
             "zipper",
             "zodiac",
             "zombie",
         ] 
word = random.choice(words)
guessed_words=[]
# Create a list to store the revealed letters (start with underscores)
revealed_letters = ["_" for _ in word]
print(" ".join(revealed_letters))
total_guessed=[]
# Ask the user to guess a letter
while True:
  time_first = True
  guess = input("Guess a letter: ")
  if guess not in total_guessed:
    total_guessed.append(guess)
    if guess in word:
      print("Correct!")
      for i, letter in enumerate(word):
        if letter == guess:
          revealed_letters[i] = guess  # Update revealed_letters
  
      print(" ".join(revealed_letters))
      if "_" not in revealed_letters:
        print("You Won!")
        break
  # ignore this
    # if guess in word:
    #   print("Correct!")
    #   for x in range(len(word)):
    #     if word[x] == guess:
    #       num = x
    #   if num == 0:
    #     print(guess, "__ __")
    #   elif num == 1:
    #     print("__", guess, "__")
    #   else:
    #     print( "__ __", guess)
  
    
    #drawing body parts in a very inefficient way
    else:
      print("Oops! Letter is not in the word")
      if guess not in guessed_words:
        guessed_words.append(guess)
      print(" ".join(revealed_letters))
      if body_parts == 0:
        # t.penup()
        # t.right(90)
        # t.forward(0.1)
        # t.forward(20)
        t.pendown()
        t.circle(10)
        body_parts=1
      elif body_parts == 1:
        t.right(90)
        t.penup()
        t.backward(10)
        t.pendown()
        t.left(90)
        t.penup()
        t.forward(10)
        t.pendown()
        t.forward(30)
        body_parts=2
      elif body_parts == 2:
        t.penup()
        t.right(180)
        t.forward(15)
        t.left(45)
        t.pendown()
        t.forward(10)
        body_parts=3
      elif body_parts == 3:
        t.penup()
        t.right(180)
        t.forward(10)
        t.left(90)
        t.pendown()
        t.forward(10)
        body_parts=4
      elif body_parts == 4:
        t.penup()
        t.right(180)
        t.forward(10)
        t.right(315)
        t.forward(15)
        t.right(45)
        t.pendown()
        t.forward(15)
        body_parts=5
      elif body_parts == 5:
        t.penup()
        t.right(180)
        t.forward(15)
        t.right(90)
        t.pendown()
        t.forward(15)
        print("You Lost! The word was", word)
        lost = 1
        time.sleep(2)
        t.clear()
        break
  else:
    formattedwords = " ".join(guessed_words)
    print("You already guessed this letter! Wrong Letters geussed:", formattedwords)
sc.mainloop()
  
HANGMAN CODE STATE AS OF END OF PART I 

main.py
#!/bin/python3
import random
with open("words.txt", "r") as w:
    words = [word.strip() for word in w.readlines()]
hangman_word = random.choice(words)
revealed_letters = ["_" for letter in hangman_word]
guessed_letters = []
body_parts = 0
print(" ".join(revealed_letters))
while True:
  guess = input("Guess a letter: ")
  if guess not in guessed_letters:
    guessed_letters.append(guess)
    if guess in word:
      print("Correct!")
      for i, letter in enumerate(word):
          if letter == guess:
              revealed_letters[i] = guess
      print(" ".join(revealed_letters))
      if "_" not in revealed_letters:
        print("You Won!")
        break
      else:
        print("Oops! Letter is not in the word!")
        if guess not in guessed_letters:
            guessed_letters.append(guess)
        print(" ".join(revealed_letters))
Words.txt
Same as words in the lesson contents
### Hangman II Turtle - UNFINISHED

### Hangman Final Code - UNFINISHED


## Classes - UNFINISHED
### What’s a Class?

### The __init__ Function

### Adding Functions to your Class

### Using Your Class

### Subclasses

##### Requests (Optional) - UNFINISED
###### What’s Requests?

###### How can Requests Be Used?


##### Building a Weather App (Optional) - UNFINISHED
###### Building a Weather App I

###### Building a Weather App II

###### Building a Weather App III

##### Sockets (Optional) - UNFINISHED
###### What’s a Socket?

###### Chat App - Socket Example

##### Where Next?
###### Continue Learning Python

###### Learn a Different Coding Language
