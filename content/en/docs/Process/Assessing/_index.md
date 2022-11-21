---
title: "Assessing FAIR-ness"
linkTitle: "Assessing FAIR-ness"
weight: 1
description: >
  Scoring a model's FAIR-ness
---

How did we assess each model, and how should you assess it?


## Scoring the FAIRness of a model publication
The initial scoring is based on the information provided in the publication. In the process of making the model FAIR, additional information could be broad in. The accompanying Github repository of each model publication keeps score on the improvements of the FAIR components of the published model.

Is the model code available in a publicly accessible repository? Yes/No
A link might be provided in a publication, but if the link is not working, we score it a No in the initial scoring.

Does the model have a license? Yes/No
Typically this information is provided in the publicly accessible repository.

Does the model code repository have a DOI? Yes/No
If the model code is publicly available, does the location have a DOI?

Does the model has detailed documentation? We provide below a letter grade based on a casual reading of the model publication. Whether the model documentation is sufficient to understand the details of the model can only be found out in an actual replication exercise.
A - Excellent. Documentation provides clear rational for the purpose of the model and the assumptions behind the model formulation. There is a clear description of the processes, ideally with a visual representation (flow chart). All the variables and parameters of the model are clearly defined (including units and source of estimation for the parameters). The source of data files are provided. The details of the mechanism of the model are described by mathematical equations or pseudo code.
B - Good. Compared to an A there are some details missing like sources of data to define parameter values, the units, a clear description of the order in which processes are executed, etc. For small-scale theoretical models (without data) a detailed narrative based on logical statements could be sufficient for replication of the model.
C - Satisfactory. Compared with B. Model (beyond a small theoretical model) lacks equations and pseudocode to describe the details of the model.
D - Less than Satisfactory. Compared with C. Model does not defined all variables and parameters. Values of parameters are missing. Details of the processes of the model is missing. It might not be sufficient to replicate the model.
E - Unsatisfactory. Compared to D. Lack of sufficient information to understand the basic structure of the model.

Is the model code cleaned up and well commented?
Also here we give a letter grade based on a causal evaluation of the provided code.
A - Excellent - Defines variables and parameters (including units). Describes and explains each procedure and key processes of the model. Mention version number and authors of the code. No outcommented lines of code to test the model, no informal comments among authors.
B - Good - Compared to A. Missing some details such as units, Not defined all variables and parameters. Did not mention authors of the code.
C - Satisfactory Compared to B. Becomes a bit messy. Include unnecessary lines of test code abd informal comments among authors.
D - Less than Satisfactory. Compared to C. Does not define variables and parameters. Does not provide description of procedures. One may understand the workings of the code, but it will take a lot of effort.
E - Unsatisfactory - code dump. No relevant comments, many outcommented lines of code. Unclear what code is actually used for the model.
