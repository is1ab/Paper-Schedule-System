--
-- PostgreSQL database cluster dump
--

-- Started on 2024-05-30 23:48:45

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE is1ab_admin;
ALTER ROLE is1ab_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:9CYCCGtgqmphcoFJSAuoJw==$c0Lam5bpsgWkLnMc/nz4kU8NXmfT2pWKXlXYYmXPmZA=:L4Wvg8HzLbGm8E2l5rHtpXEe8/XMF/SLL5khtBOJujE=';

--
-- User Configurations
--






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6 (Debian 15.6-1.pgdg120+2)
-- Dumped by pg_dump version 16.2

-- Started on 2024-05-30 23:48:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2024-05-30 23:48:45

--
-- PostgreSQL database dump complete
--

--
-- Database "PSS" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6 (Debian 15.6-1.pgdg120+2)
-- Dumped by pg_dump version 16.2

-- Started on 2024-05-30 23:48:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3464 (class 1262 OID 16384)
-- Name: PSS; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "PSS" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\connect "PSS"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 24876)
-- Name: action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.action (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying NOT NULL,
    "messagePattern" character varying NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 32800)
-- Name: announcement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying NOT NULL,
    description character varying NOT NULL,
    "validStartDate" date NOT NULL,
    "validEndDate" date NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 24882)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "actionId" uuid NOT NULL,
    "userId" integer,
    ip character varying NOT NULL,
    "createTime" timestamp without time zone NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 24888)
-- Name: audit_log_parameter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log_parameter (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "auditLogId" uuid NOT NULL,
    "parameterName" character varying NOT NULL,
    "parameterValue" character varying NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 24894)
-- Name: holiday_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.holiday_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 219 (class 1259 OID 24895)
-- Name: holiday; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.holiday (
    id bigint DEFAULT nextval('public.holiday_id_seq'::regclass) NOT NULL,
    name character varying,
    date date
);


--
-- TOC entry 220 (class 1259 OID 24901)
-- Name: host_rule_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.host_rule_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 221 (class 1259 OID 24902)
-- Name: host_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.host_rule (
    id bigint DEFAULT nextval('public.host_rule_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    period bigint NOT NULL,
    weekday bigint NOT NULL,
    rule character varying NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 24909)
-- Name: host_rule_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.host_rule_schedule (
    "hostRuleId" bigint NOT NULL,
    iteration bigint NOT NULL,
    "scheduleId" uuid NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 24610)
-- Name: host_rule_sequence; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.host_rule_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 230 (class 1259 OID 32772)
-- Name: host_rule_swap_id; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.host_rule_swap_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 231 (class 1259 OID 32790)
-- Name: host_rule_temporary_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.host_rule_temporary_event (
    "hostRuleId" bigint NOT NULL,
    "scheduleId" uuid NOT NULL,
    "isReplace" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 24912)
-- Name: host_rule_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.host_rule_user (
    "hostRuleId" bigint NOT NULL,
    account character varying NOT NULL,
    index bigint
);


--
-- TOC entry 224 (class 1259 OID 24917)
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 24922)
-- Name: schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying,
    link character varying,
    description character varying NOT NULL,
    date date,
    status integer NOT NULL,
    "userId" character varying NOT NULL,
    archived boolean DEFAULT false NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 24929)
-- Name: schedule_attachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_attachment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "scheduleId" uuid NOT NULL,
    "fileName" character varying NOT NULL,
    "fileType" character varying NOT NULL,
    "fileRealName" character varying NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 24935)
-- Name: schedule_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_status (
    id integer NOT NULL,
    status character varying NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 32840)
-- Name: system_argument; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_argument (
    key character varying NOT NULL,
    value character varying NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 24940)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 229 (class 1259 OID 24941)
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer DEFAULT nextval('public.user_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    note character varying NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    role integer NOT NULL,
    account character varying NOT NULL
);

INSERT INTO public."role" (id, "name") VALUES(3, 'Guest');
INSERT INTO public."role" (id, "name") VALUES(2, 'Student');
INSERT INTO public."role" (id, "name") VALUES(1, 'Professor');
INSERT INTO public.system_argument ("key", value) VALUES('LAB_EN', 'Information Security Lab');
INSERT INTO public.system_argument ("key", value) VALUES('ORG_EN', 'NTUT');
INSERT INTO public.system_argument ("key", value) VALUES('ORG_ZH', '國立臺北科技大學');
INSERT INTO public.system_argument ("key", value) VALUES('LAB_ZH', '資訊安全實驗室');
INSERT INTO public."action" (id, "type", "messagePattern") VALUES('56b89550-33b1-41b9-ab5b-61f20e2bddf5'::uuid, 'REQUEST', 'User {user} request the route {route}');
INSERT INTO public."action" (id, "type", "messagePattern") VALUES('e91c0efd-317a-4245-a87d-74c2fd60651b'::uuid, 'ACTION', 'User {user} confirm the schedule {scheduleId}');
INSERT INTO public."action" (id, "type", "messagePattern") VALUES('bf6c7a9e-9f08-4307-b7f4-581d6cd3e995'::uuid, 'ACTION', 'System send the notice email for the schedule {scheduleId}');
INSERT INTO public."action" (id, "type", "messagePattern") VALUES('979c718a-9c7a-4424-9344-09c3747f8a32'::uuid, 'ACTION', 'User {user} set the datetime {datetime} on the schedule {scheduleId}');
INSERT INTO public.schedule_status (id, status) VALUES(1, '等待審核中');
INSERT INTO public.schedule_status (id, status) VALUES(2, '已完成');
INSERT INTO public.schedule_status (id, status) VALUES(3, '已拒絕');
INSERT INTO public.schedule_status (id, status) VALUES(4, '等待規劃中');
INSERT INTO public.schedule_status (id, status) VALUES(5, '臨時事件');
INSERT INTO public."user" ("name", email, note, "blocked", "role", account) VALUES('黃漢軒', 't109590031@ntut.org.tw', '大學部、顧問', false, 2, '109590031');

--
-- TOC entry 3273 (class 2606 OID 24949)
-- Name: action action_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_pk PRIMARY KEY (id);


--
-- TOC entry 3300 (class 2606 OID 32823)
-- Name: announcement announcement_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT announcement_pk PRIMARY KEY (id);


--
-- TOC entry 3302 (class 2606 OID 32821)
-- Name: announcement announcement_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT announcement_unique UNIQUE (id);


--
-- TOC entry 3279 (class 2606 OID 24951)
-- Name: audit_log_parameter audit_log_parameter_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_parameter
    ADD CONSTRAINT audit_log_parameter_pk PRIMARY KEY (id);


--
-- TOC entry 3275 (class 2606 OID 24953)
-- Name: audit_log audit_log_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pk PRIMARY KEY (id);


--
-- TOC entry 3281 (class 2606 OID 24955)
-- Name: host_rule host_rule_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.host_rule
    ADD CONSTRAINT host_rule_pk PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 24957)
-- Name: host_rule_schedule host_rule_schedule_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.host_rule_schedule
    ADD CONSTRAINT host_rule_schedule_pk PRIMARY KEY ("hostRuleId", iteration);


--
-- TOC entry 3285 (class 2606 OID 24959)
-- Name: host_rule_user host_rule_user_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.host_rule_user
    ADD CONSTRAINT host_rule_user_pk PRIMARY KEY ("hostRuleId", account);


--
-- TOC entry 3287 (class 2606 OID 24961)
-- Name: role role_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pk PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 24963)
-- Name: schedule_attachment schedule_attachment_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_attachment
    ADD CONSTRAINT schedule_attachment_pk PRIMARY KEY (id);


--
-- TOC entry 3289 (class 2606 OID 24965)
-- Name: schedule schedule_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pk PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 32846)
-- Name: system_argument system_argument_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_argument
    ADD CONSTRAINT system_argument_unique UNIQUE (key);


--
-- TOC entry 3307 (class 2606 OID 32848)
-- Name: system_argument system_argument_unique_1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_argument
    ADD CONSTRAINT system_argument_unique_1 UNIQUE (key);


--
-- TOC entry 3309 (class 2606 OID 32851)
-- Name: system_argument system_argument_unique_2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_argument
    ADD CONSTRAINT system_argument_unique_2 UNIQUE (key);


--
-- TOC entry 3293 (class 2606 OID 24967)
-- Name: user user_account_un; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_account_un UNIQUE (account);


--
-- TOC entry 3296 (class 2606 OID 24969)
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 24971)
-- Name: user user_un; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_un UNIQUE (email);


--
-- TOC entry 3277 (class 1259 OID 24972)
-- Name: audit_log_parameter_auditlogid_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_parameter_auditlogid_idx ON public.audit_log_parameter USING btree ("auditLogId");


--
-- TOC entry 3276 (class 1259 OID 24973)
-- Name: audit_log_userid_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_userid_idx ON public.audit_log USING btree ("userId");


--
-- TOC entry 3303 (class 1259 OID 32849)
-- Name: system_argument_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_argument_key_idx ON public.system_argument USING btree (key);


--
-- TOC entry 3294 (class 1259 OID 24974)
-- Name: user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_id_idx ON public."user" USING btree (id);


--
-- TOC entry 3310 (class 2606 OID 24975)
-- Name: audit_log audit_log_action_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_action_fk FOREIGN KEY ("actionId") REFERENCES public.action(id);


--
-- TOC entry 3312 (class 2606 OID 24980)
-- Name: audit_log_parameter audit_log_parameter_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_parameter
    ADD CONSTRAINT audit_log_parameter_fk FOREIGN KEY ("auditLogId") REFERENCES public.audit_log(id);


--
-- TOC entry 3311 (class 2606 OID 24985)
-- Name: audit_log audit_log_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_fk FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3313 (class 2606 OID 24990)
-- Name: host_rule_schedule host_rule_schedule_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.host_rule_schedule
    ADD CONSTRAINT host_rule_schedule_fk FOREIGN KEY ("scheduleId") REFERENCES public.schedule(id);


--
-- TOC entry 3314 (class 2606 OID 24995)
-- Name: host_rule_user host_rule_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.host_rule_user
    ADD CONSTRAINT host_rule_user_fk FOREIGN KEY (account) REFERENCES public."user"(account);


--
-- TOC entry 3315 (class 2606 OID 25000)
-- Name: host_rule_user host_rule_user_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.host_rule_user
    ADD CONSTRAINT host_rule_user_fk_1 FOREIGN KEY ("hostRuleId") REFERENCES public.host_rule(id);


--
-- TOC entry 3316 (class 2606 OID 25005)
-- Name: schedule_attachment schedule_attachment_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_attachment
    ADD CONSTRAINT schedule_attachment_fk FOREIGN KEY ("scheduleId") REFERENCES public.schedule(id);


-- Completed on 2024-05-30 23:48:45

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6 (Debian 15.6-1.pgdg120+2)
-- Dumped by pg_dump version 16.2

-- Started on 2024-05-30 23:48:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2024-05-30 23:48:46

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-05-30 23:48:46

--
-- PostgreSQL database cluster dump complete
--

