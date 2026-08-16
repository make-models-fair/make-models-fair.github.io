---
title: "Assess a Model's FAIR criteria"
linkTitle: "Assess a Model"
weight: 1
---

Each model has been initially assessed against the five FAIR criteria based on the information provided in the associated publication (see each model's assessment on the [Models](/docs/models/) page). In the process of making the model FAIR, additional information may need to be brought in beyond what was only provided in the publication. The accompanying GitHub repository for each model publication will serve to keep the score on the improvements of the FAIR components of the published model.

Each of the five FAIR criteria are outlined below, with their associated "scoring" options.
For the sake of this initiative, __a model would be considered FAIR once it achieves the bolded option for each criterion.__

----------------

#### __Criterion 1.__ Available code
_Is the model code available in a publicly accessible repository?_
* __Yes__
* No

A link might be provided in a publication; but if the link is not working, we score it a No in the initial scoring.

----------------

#### __Criterion 2.__ License
_Does the model have a license?_
* __Yes__
* No

Typically, license information is provided in the publicly accessible repository.

----------------

#### __Criterion 3.__ DOI
_Does the model code repository have a DOI?_
* __Yes__
* No

If the model code is publicly available, does the location have a DOI?

----------------

#### __Criterion 4.__ Model Documentation
_Does the model has detailed documentation?_

We provide a letter grade based on a casual reading of the model publication. Whether the model documentation is sufficient to understand the details of the model can only be found out in an actual replication exercise.

* __A - Excellent.__
  - Documentation provides clear rational for the purpose of the model and the assumptions behind the model formulation. There is a clear description of the processes, ideally with a visual representation (flow chart). All the variables and parameters of the model are clearly defined (including units and source of estimation for the parameters). The source of data files are provided. The details of the mechanism of the model are described by mathematical equations or pseudo code.
* B - Good.
  - Compared to an A. there are some details missing like sources of data to define parameter values, the units, a clear description of the order in which processes are executed, etc. For small-scale theoretical models (without data) a detailed narrative based on logical statements could be sufficient for replication of the model.
* C - Satisfactory.
  - Compared with B. Model (beyond a small theoretical model) lacks equations and pseudocode to describe the details of the model.
* D - Less than Satisfactory.
  - Compared with C. Model does not defined all variables and parameters. Values of parameters are missing. Details of the processes of the model is missing. It might not be sufficient to replicate the model.
* E - Unsatisfactory.
  - Compared to D. Lack of sufficient information to understand the basic structure of the model.

  ----------------

#### __Criterion 5.__ Clean Model Code
_Is the model code cleaned up and well commented?_

We provide a letter grade based on a causal evaluation of the provided code (if code was provided). This criterion is not able to be graded at all until there is available code.

* __A - Excellent.__
  - Defines variables and parameters (including units). Describes and explains each procedure and key processes of the model. Mentions version number and authors of the code. No outcommented lines of code to test the model, and no informal comments among authors.
* B - Good.
  - Compared to A. Missing some details such as units, has not defined all variables and parameters, did not mention authors of the code.
* C - Satisfactory.
  - Compared to B. Becomes a bit messy, includes unnecessary lines of test code and informal comments among authors.
* D - Less than Satisfactory.
  - Compared to C. Does not define variables and parameters, does not provide description of procedures. One may understand the workings of the code, but it will take a lot of effort.
* E - Unsatisfactory.
  - Code dump. No relevant comments, many outcommented lines of code, unclear what code is actually used for the model.
