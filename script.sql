--
-- PostgreSQL database cluster dump
--

-- Started on 2024-06-10 04:52:01 CST

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

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

-- Dumped from database version 15.7 (Debian 15.7-1.pgdg120+1)
-- Dumped by pg_dump version 16.2 (Homebrew)

-- Started on 2024-06-10 04:52:02 CST

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

-- Completed on 2024-06-10 04:52:02 CST

--
-- PostgreSQL database dump complete
--

--
-- Database "PSS" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7 (Debian 15.7-1.pgdg120+1)
-- Dumped by pg_dump version 16.2 (Homebrew)

-- Started on 2024-06-10 04:52:02 CST

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
-- TOC entry 3468 (class 1262 OID 16385)
-- Name: PSS; Type: DATABASE; Schema: -; Owner: is1ab_admin
--

CREATE DATABASE "PSS" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "PSS" OWNER TO is1ab_admin;

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
-- TOC entry 214 (class 1259 OID 16386)
-- Name: action; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.action (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying NOT NULL,
    "messagePattern" character varying NOT NULL
);


ALTER TABLE public.action OWNER TO is1ab_admin;

--
-- TOC entry 215 (class 1259 OID 16392)
-- Name: announcement; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.announcement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying NOT NULL,
    description character varying NOT NULL,
    "validStartDate" date NOT NULL,
    "validEndDate" date NOT NULL
);


ALTER TABLE public.announcement OWNER TO is1ab_admin;

--
-- TOC entry 216 (class 1259 OID 16398)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "actionId" uuid NOT NULL,
    "userId" integer,
    ip character varying NOT NULL,
    "createTime" timestamp without time zone NOT NULL
);


ALTER TABLE public.audit_log OWNER TO is1ab_admin;

--
-- TOC entry 217 (class 1259 OID 16404)
-- Name: audit_log_parameter; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.audit_log_parameter (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "auditLogId" uuid NOT NULL,
    "parameterName" character varying NOT NULL,
    "parameterValue" character varying NOT NULL
);


ALTER TABLE public.audit_log_parameter OWNER TO is1ab_admin;

--
-- TOC entry 218 (class 1259 OID 16410)
-- Name: holiday_id_seq; Type: SEQUENCE; Schema: public; Owner: is1ab_admin
--

CREATE SEQUENCE public.holiday_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.holiday_id_seq OWNER TO is1ab_admin;

--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: holiday; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.holiday (
    id bigint DEFAULT nextval('public.holiday_id_seq'::regclass) NOT NULL,
    name character varying,
    date date
);


ALTER TABLE public.holiday OWNER TO is1ab_admin;

--
-- TOC entry 220 (class 1259 OID 16417)
-- Name: host_rule_seq; Type: SEQUENCE; Schema: public; Owner: is1ab_admin
--

CREATE SEQUENCE public.host_rule_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.host_rule_seq OWNER TO is1ab_admin;

--
-- TOC entry 221 (class 1259 OID 16418)
-- Name: host_rule; Type: TABLE; Schema: public; Owner: is1ab_admin
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


ALTER TABLE public.host_rule OWNER TO is1ab_admin;

--
-- TOC entry 222 (class 1259 OID 16425)
-- Name: host_rule_schedule; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.host_rule_schedule (
    "hostRuleId" bigint NOT NULL,
    iteration bigint NOT NULL,
    "scheduleId" uuid NOT NULL
);


ALTER TABLE public.host_rule_schedule OWNER TO is1ab_admin;

--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: host_rule_sequence; Type: SEQUENCE; Schema: public; Owner: is1ab_admin
--

CREATE SEQUENCE public.host_rule_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.host_rule_sequence OWNER TO is1ab_admin;

--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: host_rule_swap_id; Type: SEQUENCE; Schema: public; Owner: is1ab_admin
--

CREATE SEQUENCE public.host_rule_swap_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.host_rule_swap_id OWNER TO is1ab_admin;

--
-- TOC entry 225 (class 1259 OID 16430)
-- Name: host_rule_temporary_event; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.host_rule_temporary_event (
    "hostRuleId" bigint NOT NULL,
    "scheduleId" uuid NOT NULL,
    "isReplace" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.host_rule_temporary_event OWNER TO is1ab_admin;

--
-- TOC entry 226 (class 1259 OID 16434)
-- Name: host_rule_user; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.host_rule_user (
    "hostRuleId" bigint NOT NULL,
    account character varying NOT NULL,
    index bigint
);


ALTER TABLE public.host_rule_user OWNER TO is1ab_admin;

--
-- TOC entry 227 (class 1259 OID 16439)
-- Name: role; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.role OWNER TO is1ab_admin;

--
-- TOC entry 228 (class 1259 OID 16444)
-- Name: schedule; Type: TABLE; Schema: public; Owner: is1ab_admin
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


ALTER TABLE public.schedule OWNER TO is1ab_admin;

--
-- TOC entry 229 (class 1259 OID 16451)
-- Name: schedule_attachment; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.schedule_attachment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "scheduleId" uuid NOT NULL,
    "fileName" character varying NOT NULL,
    "fileType" character varying NOT NULL,
    "fileRealName" character varying NOT NULL
);


ALTER TABLE public.schedule_attachment OWNER TO is1ab_admin;

--
-- TOC entry 230 (class 1259 OID 16457)
-- Name: schedule_status; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.schedule_status (
    id integer NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.schedule_status OWNER TO is1ab_admin;

--
-- TOC entry 231 (class 1259 OID 16462)
-- Name: system_argument; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.system_argument (
    key character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE public.system_argument OWNER TO is1ab_admin;

--
-- TOC entry 232 (class 1259 OID 16467)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: is1ab_admin
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO is1ab_admin;

--
-- TOC entry 233 (class 1259 OID 16468)
-- Name: user; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public."user" (
    id integer DEFAULT nextval('public.user_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    note character varying NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    account character varying NOT NULL,
    password character varying
);


ALTER TABLE public."user" OWNER TO is1ab_admin;

--
-- TOC entry 234 (class 1259 OID 16553)
-- Name: user_role; Type: TABLE; Schema: public; Owner: is1ab_admin
--

CREATE TABLE public.user_role (
    account character varying NOT NULL,
    "roleId" bigint NOT NULL
);


ALTER TABLE public.user_role OWNER TO is1ab_admin;

INSERT INTO public.user_role (account, "roleId") VALUES('root', 5);
INSERT INTO public."role" (id, "name") VALUES(5, 'Root');
INSERT INTO public."role" (id, "name") VALUES(4, 'Admin');
INSERT INTO public."role" (id, "name") VALUES(3, 'Professor');
INSERT INTO public."role" (id, "name") VALUES(2, 'Student');
INSERT INTO public."role" (id, "name") VALUES(1, 'Guest');
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
INSERT INTO public."user" ("name", email, note, "blocked", "role", account, "password") VALUES('管理員', 'root@pss.net', '管理員', false, 5, 'root', '981ca9fb9f590f6e5bdfdefbcb45aefc9d6f3b80b1973a9c3c6bf62d347c3f77');

--
-- TOC entry 3277 (class 2606 OID 16476)
-- Name: action action_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_pk PRIMARY KEY (id);


--
-- TOC entry 3279 (class 2606 OID 16478)
-- Name: announcement announcement_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT announcement_pk PRIMARY KEY (id);


--
-- TOC entry 3281 (class 2606 OID 16480)
-- Name: announcement announcement_unique; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT announcement_unique UNIQUE (id);


--
-- TOC entry 3287 (class 2606 OID 16482)
-- Name: audit_log_parameter audit_log_parameter_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.audit_log_parameter
    ADD CONSTRAINT audit_log_parameter_pk PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 16484)
-- Name: audit_log audit_log_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pk PRIMARY KEY (id);


--
-- TOC entry 3289 (class 2606 OID 16486)
-- Name: host_rule host_rule_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.host_rule
    ADD CONSTRAINT host_rule_pk PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 16488)
-- Name: host_rule_schedule host_rule_schedule_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.host_rule_schedule
    ADD CONSTRAINT host_rule_schedule_pk PRIMARY KEY ("hostRuleId", iteration);


--
-- TOC entry 3293 (class 2606 OID 16490)
-- Name: host_rule_user host_rule_user_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.host_rule_user
    ADD CONSTRAINT host_rule_user_pk PRIMARY KEY ("hostRuleId", account);


--
-- TOC entry 3295 (class 2606 OID 16492)
-- Name: role role_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pk PRIMARY KEY (id);


--
-- TOC entry 3299 (class 2606 OID 16494)
-- Name: schedule_attachment schedule_attachment_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.schedule_attachment
    ADD CONSTRAINT schedule_attachment_pk PRIMARY KEY (id);


--
-- TOC entry 3297 (class 2606 OID 16496)
-- Name: schedule schedule_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pk PRIMARY KEY (id);


--
-- TOC entry 3302 (class 2606 OID 16498)
-- Name: system_argument system_argument_unique; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.system_argument
    ADD CONSTRAINT system_argument_unique UNIQUE (key);


--
-- TOC entry 3304 (class 2606 OID 16500)
-- Name: system_argument system_argument_unique_1; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.system_argument
    ADD CONSTRAINT system_argument_unique_1 UNIQUE (key);


--
-- TOC entry 3306 (class 2606 OID 16502)
-- Name: system_argument system_argument_unique_2; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.system_argument
    ADD CONSTRAINT system_argument_unique_2 UNIQUE (key);


--
-- TOC entry 3308 (class 2606 OID 16504)
-- Name: user user_account_un; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_account_un UNIQUE (account);


--
-- TOC entry 3311 (class 2606 OID 16506)
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 16508)
-- Name: user user_un; Type: CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_un UNIQUE (email);


--
-- TOC entry 3285 (class 1259 OID 16509)
-- Name: audit_log_parameter_auditlogid_idx; Type: INDEX; Schema: public; Owner: is1ab_admin
--

CREATE INDEX audit_log_parameter_auditlogid_idx ON public.audit_log_parameter USING btree ("auditLogId");


--
-- TOC entry 3284 (class 1259 OID 16510)
-- Name: audit_log_userid_idx; Type: INDEX; Schema: public; Owner: is1ab_admin
--

CREATE INDEX audit_log_userid_idx ON public.audit_log USING btree ("userId");


--
-- TOC entry 3300 (class 1259 OID 16511)
-- Name: system_argument_key_idx; Type: INDEX; Schema: public; Owner: is1ab_admin
--

CREATE INDEX system_argument_key_idx ON public.system_argument USING btree (key);


--
-- TOC entry 3309 (class 1259 OID 16512)
-- Name: user_id_idx; Type: INDEX; Schema: public; Owner: is1ab_admin
--

CREATE INDEX user_id_idx ON public."user" USING btree (id);


--
-- TOC entry 3314 (class 2606 OID 16513)
-- Name: audit_log audit_log_action_fk; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_action_fk FOREIGN KEY ("actionId") REFERENCES public.action(id);


--
-- TOC entry 3316 (class 2606 OID 16518)
-- Name: audit_log_parameter audit_log_parameter_fk; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.audit_log_parameter
    ADD CONSTRAINT audit_log_parameter_fk FOREIGN KEY ("auditLogId") REFERENCES public.audit_log(id);


--
-- TOC entry 3315 (class 2606 OID 16523)
-- Name: audit_log audit_log_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_fk FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3317 (class 2606 OID 16528)
-- Name: host_rule_schedule host_rule_schedule_fk; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.host_rule_schedule
    ADD CONSTRAINT host_rule_schedule_fk FOREIGN KEY ("scheduleId") REFERENCES public.schedule(id);


--
-- TOC entry 3318 (class 2606 OID 16533)
-- Name: host_rule_user host_rule_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.host_rule_user
    ADD CONSTRAINT host_rule_user_fk FOREIGN KEY (account) REFERENCES public."user"(account);


--
-- TOC entry 3319 (class 2606 OID 16538)
-- Name: host_rule_user host_rule_user_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.host_rule_user
    ADD CONSTRAINT host_rule_user_fk_1 FOREIGN KEY ("hostRuleId") REFERENCES public.host_rule(id);


--
-- TOC entry 3320 (class 2606 OID 16543)
-- Name: schedule_attachment schedule_attachment_fk; Type: FK CONSTRAINT; Schema: public; Owner: is1ab_admin
--

ALTER TABLE ONLY public.schedule_attachment
    ADD CONSTRAINT schedule_attachment_fk FOREIGN KEY ("scheduleId") REFERENCES public.schedule(id);


-- Completed on 2024-06-10 04:52:02 CST

--
-- PostgreSQL database dump complete
--

--
-- Database "is1ab_admin" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7 (Debian 15.7-1.pgdg120+1)
-- Dumped by pg_dump version 16.2 (Homebrew)

-- Started on 2024-06-10 04:52:02 CST

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
-- TOC entry 3341 (class 1262 OID 16384)
-- Name: is1ab_admin; Type: DATABASE; Schema: -; Owner: is1ab_admin
--

CREATE DATABASE is1ab_admin WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE is1ab_admin OWNER TO is1ab_admin;

\connect is1ab_admin

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

-- Completed on 2024-06-10 04:52:02 CST

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

-- Dumped from database version 15.7 (Debian 15.7-1.pgdg120+1)
-- Dumped by pg_dump version 16.2 (Homebrew)

-- Started on 2024-06-10 04:52:02 CST

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

-- Completed on 2024-06-10 04:52:02 CST

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-06-10 04:52:02 CST

--
-- PostgreSQL database cluster dump complete
--

