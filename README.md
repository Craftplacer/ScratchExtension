# Craftplacer's ScratchX Extension
The title literally says what it is.
[Open ScratchX with this extension](http://scratchx.org/?url=https://craftplacer.github.io/ScratchExtension/extension.js)

**NOTE:** It is recommened to use Google Chrome for this extension as it's using emojis at some places like the variable blocks.

## Categories and Blocks

### Booleans

### Strings

### Images

### Canvas

### Sounds

### Variables

#### ![variableGet](/scratchblocks/variableGet.png?raw=true)
Gets the variable you have specified.

#### ![variableGetBoolean](/scratchblocks/variableGetBoolean.png?raw=true)
Does the same thing as above, **but converts it to a boolean.**

#### ![variableSet](/scratchblocks/variableSet.png?raw=true)
Sets the variable with the value you specified.

#### ![variableOperation](/scratchblocks/variableOperation.png?raw=true)
Internally called `variableOperation`, this block might look confusing at first, but you know programming enough you might recognize it as the block that increments the variable.
This makes it easier to change the number of a variable since you don't have to use `[set [variable] to (variable + (1))]`. 
In the third field you can choose from `++` (increment) and `--` (decrement). The fourth field is what the value is to do the operation (default: 1).

#### ![variableDelete](/scratchblocks/variableDelete.png?raw=true)
Deletes the variable you specified

#### ![variableExists](/scratchblocks/variableExists.png?raw=true)
Checks if the variable has been set before/exists.

### Misc

## Variable Types

| Emoji | Description                                     | Stored temporaily | Stored locally |
|-------|-------------------------------------------------|-------------------|----------------|
| 🐱    | Variable stored in Scratch/extension            | X                 |                |
| 💾    | Variable stored in localStorage                 |                   | X              |
| 🍪    | Variable stored as cookie (not implemented yet) |                   | X              |
