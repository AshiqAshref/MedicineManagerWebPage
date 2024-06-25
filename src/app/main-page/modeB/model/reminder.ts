import { Medicine } from "./medicine"
import { Time } from "./time"

export interface Reminder extends Medicine,Time{
    medicine:Medicine,
    times:Array<Time>
} 