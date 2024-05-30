from datetime import datetime, timedelta

import store.db.query.host_rule as host_rule_db
import store.db.query.schedule as schedule_db
from store.db.model.user import User, anonymousUser
from store.db.model.schedule import Schedule, ScheduleStatus
from store.db.model.host_rule import HostRule, HostRuleOrder, HostRuleSwapRecord, HostRuleTemporaryEvent


def generate_host_rule_pending_schedules(
    host_rule: HostRule,
):
    temporary_events: list[HostRuleTemporaryEvent] = host_rule_db.get_temporary_events(host_rule.id)
    host_rule_orders: list[User] = host_rule_db.get_host_rule_users(host_rule.id)
    arranged_host_rule_schedules: list[Schedule] = schedule_db.get_arranged_schedules_by_specific_host_rule(host_rule.id)
    host_rule_schedules: list[Schedule] = []
    start_date: datetime = host_rule.startDate
    end_date: datetime = host_rule.endDate
    weekday: int = start_date.weekday() + 1
    schedule_date: datetime = start_date
    host_index: int = 0

    if host_rule.weekday != weekday:
        schedule_date += (-1 if weekday > host_rule.weekday else 1) * timedelta(
            days=weekday - host_rule.weekday
        )

    while schedule_date <= end_date:
        arranged_temporary_schedule: Schedule | None
        is_replace: bool | None
        arranged_temporary_schedule, is_replace = _find_arranged_temporary_schedule_by_datetime(
            temporary_events,
            schedule_date
        )

        if arranged_temporary_schedule is not None:
            host_rule_schedules.append(arranged_temporary_schedule)
        
            if is_replace:
                host_index += 1
    
            schedule_date += timedelta(weeks=1)
            continue

        user: User = host_rule_orders[host_index % len(host_rule_orders)]
        iteration: int = host_index // len(host_rule_orders)
        arranged_schedule: Schedule | None = _find_arragned_schedule_by_account_and_iteration(
            arranged_host_rule_schedules, 
            host_rule.id, 
            user.account, 
            iteration
        )

        # Add pending schedule if schedule is not arranged
        if arranged_schedule is None:
            host_rule_schedules.append(
                _generate_pending_schedule(user, host_rule, iteration, schedule_date)
            )
        else:
            arranged_schedule.schedule_datetime = schedule_date
            host_rule_schedules.append(arranged_schedule)

        host_index += 1        
        schedule_date += timedelta(weeks=host_rule.period)

    return host_rule_schedules


def swap_schedule(schedules: list[Schedule], host_rule: HostRule):
    swap_records: list[HostRuleSwapRecord] = host_rule_db.get_host_rule_swap_records(host_rule.id)
    for record in swap_records:
        specific_schedule = _find_arragned_schedule_by_account_and_iteration(schedules, record.host_rule_id, record.specific_user_account, record.specific_iteration)
        swap_schedule = _find_arragned_schedule_by_account_and_iteration(schedules, record.host_rule_id, record.swap_user_account, record.swap_iteration)
        specific_schedule_index = schedules.index(specific_schedule)
        swap_schedule_index = schedules.index(swap_schedule)
        schedules[swap_schedule_index].schedule_datetime, schedules[specific_schedule_index].schedule_datetime = schedules[specific_schedule_index].schedule_datetime, schedules[swap_schedule_index].schedule_datetime
    return schedules    


def _find_arranged_temporary_schedule_by_datetime(
    temporary_events: list[HostRuleTemporaryEvent],
    date: datetime
) -> tuple[Schedule | None, bool | None]:
    temporary_schedules: list[Schedule] = []
    for temporary_event in temporary_events:
        schedule = schedule_db.get_schedule(temporary_event.schedule_id)
        assert schedule is not None
        temporary_schedules.append(schedule)

    for schedule in temporary_schedules:
        if schedule.schedule_datetime == date:
            is_replace = temporary_event.is_replace
            return (schedule, is_replace)
    return (None, None)

def _find_arragned_schedule_by_account_and_iteration(
    arranged_host_rule_schedules: list[Schedule],
    host_rule_id: int,
    account: str,
    iteration: int,
) -> Schedule | None:
    for arranged_host_rule_schedule in arranged_host_rule_schedules:
        if (
            arranged_host_rule_schedule.host_rule != None
            and arranged_host_rule_schedule.host_rule.id == host_rule_id
            and arranged_host_rule_schedule.host_rule_iterator == iteration
            and arranged_host_rule_schedule.user.account == account
        ):
            return arranged_host_rule_schedule
    return None


def _generate_pending_schedule(user: User, host_rule: HostRule, iteration: int, schedule_date: datetime):
    return Schedule(
        name="" if host_rule.rule == "SCHEDULE" else host_rule.name,
        link="",
        description="",
        status=ScheduleStatus(4, "等待規劃中")
        if host_rule.rule == "SCHEDULE"
        else ScheduleStatus(2, "已完成"),
        user=user if host_rule.rule == "SCHEDULE" else None,
        attachments=[],
        host_rule=host_rule,
        host_rule_iterator=iteration,
        schedule_datetime=schedule_date,
    )