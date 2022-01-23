# A simple Wordle Bot
Try out WORDLE guessing algorithm

### To run it:
`node index.js`

### To use it:
- You tell the bot the clue
- clue format is

`{char1},{char2},{char3},{char4},{char5}`

```
[{char}] = Character is correct at specific position.
({char}) = Character is in the word but not in the correct position.
{char} = Character is not in the word.
```

### Example:
```
# Try "ADIEU" - Round 1
# Give me some clues? a,d,[i],e,u
# Try "BLIMP" - Round 2
# Give me some clues? b,l,[i],[m],[p]
# Try "CHIMP" - Round 3
# Give me some clues? [c],h,[i],[m],[p]
# Try "CRIMP" - Round 4
# Give me some clues? [c],[r],[i],[m],[p]
# BRAVO! it's CRIMP
# Number of tries: 4
```

### Improvement:
- Find possibility and compare between possible word sets.
- Improve performance.
