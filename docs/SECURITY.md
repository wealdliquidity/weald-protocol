# Security model

## User control

- Position NFTs remain in user wallets.
- Automation approval is scoped to a selected NFT and can be revoked.
- A registered rule binds its owner and settlement recipient.
- Manual management through compatible Uniswap V3 tooling remains available.

## Data integrity

- Critical position state should come from direct contract reads.
- Indexed state is derived and rebuildable from finalized events.
- Chain ID, contract addresses, bytecode, token ordering, fee tier, and tick spacing should be checked before preparing a write.
- Interfaces should simulate calldata and show final transaction targets before wallet confirmation.

## Execution limits

An eligible rule still needs an on-chain transaction. RPC failure, insufficient gas, changing pool state, token behavior, oracle history, slippage, chain reorganization, or executor availability can delay or prevent closing.

## Reporting

Please use the contact route published at [weald.my](https://weald.my) for responsible disclosure. Avoid placing exploitable details or user data in a public issue.
