# Get started

To get started:

create .env with OPENAI_API_KEY

`yarn install`

`node evals.js`

The eval in eals/eval-001 will be run ten times. The results will be saved to ./output.

# Eval structure

Each eval contains:

- app: The codebase before transformation.
- prompt.py: A description of the transformation to be made.
- solution: The canonical solution with the complete codebase transformed.

# Purpose

Using integration tests, you can automate the testing of your agent or run Monte Carlo simulations.

<img width="1066" alt="AgentEval" src="https://github.com/jamesmurdza/agenteval/assets/33395784/5fdf3db0-47fe-4b1b-9f2c-954c8d9996e6">

# Demo

https://github.com/jamesmurdza/agenteval/assets/33395784/738f9dff-bfbb-4fd0-a1ba-c451f57cc32e

