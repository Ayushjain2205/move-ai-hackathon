module agents_island::love_points {
    use std::string;
    use aptos_framework::coin;
    use aptos_framework::event;
    use aptos_framework::account;

    /// The type of the coin
    struct LovePoints {}

    /// Events
    struct LovePointsMintEvent has drop, store {
        to: address,
        amount: u64,
    }

    struct LovePointsBurnEvent has drop, store {
        from: address,
        amount: u64,
    }

    /// Errors
    const EINSUFFICIENT_BALANCE: u64 = 1;
    const EINVALID_AMOUNT: u64 = 2;
    const ENOT_TOKEN_OWNER: u64 = 3;

    /// Initialize the Love Points coin
    fun init_module(account: &signer) {
        coin::initialize<LovePoints>(
            account,
            string::utf8(b"Love Points"),
            string::utf8(b"LP"),
            8,
            false
        );
    }

    /// Mint new Love Points
    public entry fun mint(account: &signer, to: address, amount: u64) acquires LovePoints {
        assert!(coin::is_account_registered<LovePoints>(@agents_island), EINVALID_AMOUNT);
        assert!(amount > 0, EINVALID_AMOUNT);

        coin::mint<LovePoints>(to, amount, &mut coin::mint_capability<LovePoints>());

        event::emit_event(
            &mut coin::mint_events<LovePoints>(@agents_island),
            LovePointsMintEvent { to, amount }
        );
    }

    /// Burn Love Points
    public entry fun burn(from: &signer, amount: u64) acquires LovePoints {
        assert!(amount > 0, EINVALID_AMOUNT);
        assert!(coin::balance<LovePoints>(account::get_address(from)) >= amount, EINSUFFICIENT_BALANCE);

        coin::burn<LovePoints>(from, amount, &mut coin::burn_capability<LovePoints>());

        event::emit_event(
            &mut coin::burn_events<LovePoints>(@agents_island),
            LovePointsBurnEvent { from: account::get_address(from), amount }
        );
    }

    /// Get the balance of Love Points for an account
    public fun balance_of(account: address): u64 {
        coin::balance<LovePoints>(account)
    }
} 