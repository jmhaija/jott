CREATE TABLE IF NOT EXISTS <db_schema>.ledgers
(
    ledger_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    ledger_name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    ledger_market character varying(32) COLLATE pg_catalog."default",
    ledger_region character varying(32) COLLATE pg_catalog."default",
    ledger_product character varying(32) COLLATE pg_catalog."default",
    ledger_class character varying(32) COLLATE pg_catalog."default",
    ledger_currency character(3) COLLATE pg_catalog."default",
    ledger_transaction_limit numeric(14,3) NOT NULL DEFAULT 0,
    ledger_created bigint DEFAULT (EXTRACT(epoch FROM now()))::integer,
    ledger_modified bigint DEFAULT (EXTRACT(epoch FROM now()))::integer,
    CONSTRAINT ledgers_pkey PRIMARY KEY (ledger_id)
);

CREATE TABLE IF NOT EXISTS <db_schema>.accounts
(
    account_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    account_ledger integer,
    account_name character varying(32) COLLATE pg_catalog."default",
    account_description character varying(128) COLLATE pg_catalog."default",
    account_type character varying(12) COLLATE pg_catalog."default",
    account_normal character varying(6) COLLATE pg_catalog."default",
    account_status character varying(12) COLLATE pg_catalog."default",
    account_external boolean DEFAULT false,
    account_balance numeric(14,3) DEFAULT 0,
    account_allow_negative boolean DEFAULT false,
    account_transaction_limit numeric(14,3) DEFAULT 0,
    account_created bigint DEFAULT (EXTRACT(epoch FROM now()))::integer,
    account_modified bigint DEFAULT (EXTRACT(epoch FROM now()))::integer,
    CONSTRAINT accounts_pkey PRIMARY KEY (account_id)
);

CREATE TABLE IF NOT EXISTS <db_schema>.transactions
(
    transaction_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    transaction_type character varying(12) COLLATE pg_catalog."default",
    transaction_category character varying(64) COLLATE pg_catalog."default",
    transaction_status character varying(12) COLLATE pg_catalog."default",
    transaction_description character varying(32) COLLATE pg_catalog."default",
    transaction_reference character varying(12) COLLATE pg_catalog."default",
    transaction_entries integer[],
    transaction_created bigint DEFAULT (EXTRACT(epoch FROM now()))::integer,
    CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS <db_schema>.entries
(
    entry_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    entry_account integer,
    entry_type character varying(6) COLLATE pg_catalog."default",
    entry_amount numeric(14,3),
    entry_reference character varying(12) COLLATE pg_catalog."default",
    entry_note character varying(64) COLLATE pg_catalog."default",
    entry_created bigint DEFAULT (EXTRACT(epoch FROM now()))::integer,
    CONSTRAINT entries_pkey PRIMARY KEY (entry_id)
);

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA <db_schema> TO <db_user>;
