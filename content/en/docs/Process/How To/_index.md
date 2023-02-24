---
title: "How to Make A Model FAIR"
linkTitle: "How to Make FAIR"
weight: 2
---

For each of the five FAIR criteria considered, we provide guidance on how to meet those criteria when they are absent or inadequate. These guidelines will be continually updated based on experience, reflection, and learning fostered by this initiative.

Please share your experiences or reflections on the [discussion page](https://github.com/make-models-fair/coordination/discussions) of our coordination repository so that we can all benefit from them! Additionally, you should create new issues in the associated GitHub repository for the model you are working on, to document the actions you are taking.


### __Potential Problems & Solutions__ <br> (by criterion)


#### __Criterion 1.__ Available code

| Problem                | Solution               |
|------------------------|------------------------|
| Code is not available in a publicly accessible repository.| Contact the authors and inquire about the availability of the original code of the model.<br><br> _If they provide the code:_ Ask whether it is OK to make the code publicly available. <br><br> _If the code is not findable (or authors do not want to make their code publicly available):_ Try to replicate the code from the model description of the publication (using the GitHub repository associated with this model).|
| The basic results published in the publication are not replicable.| While replication is not required to score the first criterion as "Yes" according to this initiative's assessment guidance, it does indicate that there may be issues with the code that would inhibit reproducibility. This may be an issue with differences in program or package versions, missing pieces of the code, or other bugs.|

----------------
<br>

#### __Criterion 2.__ License

| Problem                | Solution               |
|------------------------|------------------------|
| The model code has no license.| Give it a license. If you received the code from the authors, consult with them on the selection of the license.|

----------------
<br>

#### __Criterion 3.__ DOI

| Problem                | Solution               |
|------------------------|------------------------|
| The model code repository has no DOI.| Archive the model code in an archive that provides a DOI, such as [Zenodo](https://zenodo.org) or [CoMSES Net](https://comses.net). <br> * _[See here](https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content) for more information on making code citable by linking GitHub with Zenodo._ <br> * _Learn how to [archive](https://www.comses.net/codebases/add/) and [submit your model for peer review](https://www.comses.net/reviews/) on CoMSES Net._|

----------------
<br>

#### __Criterion 4.__ Model Documentation

| Problem                | Solution               |
|------------------------|------------------------|
| Documentation quality can be improved.| Improve the model description. For example, describe purpose, use flow diagrams, use equations and pseudo code, describe submodels. Provide sources of datasets used by the model. In principle the model could be replicated from the model documentation.|

----------------
<br>

#### __Criterion 5.__ Clean Model Code

| Problem                | Solution               |
|------------------------|------------------------|
| Code is not sufficiently cleaned up and commented.| Clean up the code by removing outcommenting code, provide clear variable names, comment on the meaning of each procedure, remove.|

----------------
