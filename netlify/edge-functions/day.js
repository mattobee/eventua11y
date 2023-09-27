import dayjs from 'https://esm.sh/dayjs'
import customParseFormat from 'https://esm.sh/dayjs/plugin/customParseFormat'
import isSameOrBefore from 'https://esm.sh/dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'https://esm.sh/dayjs/plugin/isSameOrAfter'
import localeData from 'https://esm.sh/dayjs/plugin/localeData'
import LocalizedFormat from 'https://esm.sh/dayjs/plugin/localizedFormat'
import utc from 'https://esm.sh/dayjs/plugin/utc'
import timezone from 'https://esm.sh/dayjs/plugin/timezone'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(localeData)
dayjs.extend(LocalizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export default dayjs;