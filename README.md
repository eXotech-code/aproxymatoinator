# Aproxymatoinator

A web-based numerical solver for systems of oridinary differential equations.

![logo](public/favicon.png)

### Motivation

I've created Aproximatoinator to find out the difference
in precision between two methods for numerical solving
of oridinary differential equations.

### Features

Aproxymatoinator supports two methods
of computation - [Runge-Kutta](https://en.wikipedia.org/wiki/Runge–Kutta_methods)
and [Euler](https://en.wikipedia.org/wiki/Euler_method).
It allows for setting the step size and step amount used in
computing the numerical approximation.

The results of computation are displayed in a beautiful
Chart.js view which supports comparison between results gotten
Runge-Kutta's and Euler's approximations for both of the variables
individualy. For example you can specify a comparison between
x-values computed with Euler's method and y-values computed
using Runge-Kutta's. The results are also available in the form
of an extendable list that contains numerical data.

The website for Aproxymatoinator is live
[here](https://www.piskiewicz.org/static/aproxymatoinator/).
