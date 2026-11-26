import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'

type Page = 'home' | 'my-library' | 'his-library' | 'recommendations' | 'our-collection' | 'collections' | 'stats'
type Album = {
  id: number
  title: string
  artist: string
  year: number
  genre: string
  cover: string
  coverLabel: string
  myRating?: number
  hisRating?: number
  mine: boolean
  his: boolean
  listenedByMe: boolean
  listenedByHim: boolean
  recommendedBy?: 'me' | 'him'
  note?: string
}

const matheusAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABkRExYTEBkWFBYcGxkeJT4pJSIiJUw3Oi0+WlBfXllQV1ZkcJB6ZGqIbFZXfap+iJSZoaKhYXiwva+cu5CeoZr/2wBDARscHCUhJUkpKUmaZ1dnmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampr/wAARCABgAGADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAgMEBQEA/8QANxAAAgIBAwIDBQUGBwAAAAAAAQIAAxEEEiExQQUTURQiYXGRIzKBodEVQkRiseEkMzRSksHx/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAECAwT/xAAbEQEBAQADAQEAAAAAAAAAAAAAARECEjEhQf/aAAwDAQACEQMRAD8AfiexG7R6idCZ6YnR2c+FYntsZtGeZ3aPWPRhe2d2xm0TwAhowAWdCwlZCxUOpYdgYzbFowoLCCxgWEFhowsLCCxgWEFi0Yz+ek6uR3kP+I/n+kA23r1Yj6SdW09xnh1maLNQ33Sx+Qhb9SO7/SLQ0gc/+zL8X1b1sKKmxkZcjr8p3zNSO7fQTO15Y6jc+ckDrDQUrc8GbvhOqawGqwliBlSf6TAQ8zS8MDPqQiOEbaTk9IrTkb6tg54hh/lI/Z9Rj/V1/T+055OoH8XV9P7Q2BeHGOkIMJDXVbn7TWIPTaMzmzVD+JT/AIn9IBetGMe59TAbTpn3kTnnkCJ8y3/f+cU+5sbufxmetOqpaNOegrz/ACnE42kpYAFiC3T3pIF+E9tbjB+XENLFP7MqYEhiflM/xbwgeytdW2XrGcY6iOe9acB7lX4H9Il/EKyhAJcEYxjENHVgpWdwmt4fpR7QpLEZU5PoImmkdR39ZZXW4A7YivJc4fF/sAYDGo3ZHHEF9BZWN3njbjvxF1Mw4aMYsRgk49MR9k3hhO9VH+YzfgIPvnkP9Y4Cs43A/SEBVjlWz8IanqcCoJ91mx2UdYR2Cvlgp7k9pO+tWl/tHDnP3x2HwEh8atsISyvd5TrhmU8H5zKNlzavTVoS+oqOOBg9TMvW+KNaCmnyi927n9JmEjuYOV9ZcmELnOe88GYHrLB4e5pFiXVvkZwD2kjqVYq3UQ08X6ZsgGaGltFvB6zG09uwYMr09mLQRIrSNbaMzpZCME5I7QBZkQHvFLq/rx1H/cULlPhhapfvAqfQzpNQAyCM/GLexEoW1agKy3vEdee8WN75ZS/w28A/nLZpq9OptZ7Mum7HJ5/GXV6hkUV1VAg+7gkEflMlNatbqVFj47PgwbdZfztOwHoF7D0zDLRsH48MamptiqGr/d6dZlsJZrtU+qqHmHLoeMDtiQ+YNvMc0L/CtWa7hS1mxG7kZAMld2e6xvU5k6hnO48L/WUU6oUraDWG3oVye0LBHMnMr07SRSGGY+g+9iKrjZpbKgTlmHQBiOvcZzF6duRPW2iraTnGT+7mRPVcvFmnp20OvmqVPQEZAktYvyQa/LDcgHgH8esptuHswusAB4GAMEyNLxc7KrvWHPfBA/CVGbILp2OJQlN+oT7FN2OvIk1i+YRsZSBBQbRjJmjMV9V9RIelwB6jiTpXl8MDt+cbknIyees5kDgDmJUMYcAAcdoh19OkcDunmUe8M9pMa5oK+kcpwcxYQgnENFJYCINLRtnkyuvbdVZWCyWD3kbsfhJKEOAg7yrV1bHQNhAB7pHQ/H5yf074jOrd6vKcKw7ZHInqnrBXcCuOCy/pC1ejsJbUUrurJ5284kq5HUEfOUh//9k='

const thiagoAvatar = 'data:image/jpeg;base64,NjaDk7OzOuSzVr5YDw6kixGnbJi1f6vO6E5nKp7GPsGIg0SUTH3zvq1ANCf27BFxWABYCW2LUmNlKtKEcg2ovib1Kz9t6C+IaqqsH9Qm3Nf7q0BBhrVo+Lo9toKNzHQBjXXk44p4PjKyPkXtdZjDQ6eeZ+cpmssTHXVlPJs97GuzDdQuoPBr8AmINK0XzPJJr2XVqijeQ8WyVncCbhVROW3RGU0a452GPybVFOGu9g1VY3TNLX845VniWV9vv8AcyLr7LPge9wfZoZWO3Z2msLcALuE3EeLKzA0ZS874ps/yYMx+pFTXeuUmYdY9AJPIvYtprFW+0GBPULjWu9PdktL72FY4rSVPIQQyuA7NSdxibLnoudL7cg2LafruK2ojxLdSqwQZtMze1YQPNR89NQdnqr6UO1dVB1E/wBt95XCxcHJ7cfKbIyOUUksW5synliZSUXb+PbCb8P0x6Meu+sXfiMMOxuOPf4+AYGgsnfM7s5bO/I8HBzWoOXb37bX5TlxFR1L72ctbqvfGrfJmeVan5B7eQ6JjE7YRfCepg19y1rndenVfkZ3XVrrx/3uyx9T8A/G4oiVqYuOkbGmypxBzRfJ9nc3zctyd3gJCGN5gUm2x9uBr4/swHt0Y/iY19lF/VepnMmKOT3a4n3NzcEE5TlEciN9m5WV1V18Epw7DVYCtY+q1Dxy5vk5FTBBtn/dbOzjQ0Ny7RB1K6za1xHcFmkrf/VyLGqns0XCWLo/IM38AxTF94xF2ViY/wDkszIw7smdW1VdmcaqRURjp4jnyBxRnZcfKeUV963iJkI9kWhbGSoVRKN33V7Ysqim/stX1CuyN4lw8n+IM3AYhlJ4J0vqC4mG3XX4V/7bmtOVksN2f8L5bIJYUju5ORabbcBlqTxokIGy/JyDHtM/aHzCOM3uLeyRnFgb+O/gQ0ukssZ1y8c4ktf6kgJQAsD2XW55oWJqdzwlvZo34sTt1nI4jls8xN7hjLBZCIRomb1Oe/4iCUJyfMyvycnAq711FPevsfnZ+z0jkcGnhUx5u1LC29zkW32cpSOVuI6r1Pz8bmhOTCb3HXlK3hnqMPgNqDTQVGLjsxKaIGhXb2cfGqNz4+W+PGyH7KcRK4zn8Oy0Y3/j9JBB5CKDR04ncxtq2FYyN/Dfx7lg1AeSkfGvlbSJj5KCGs7PkliZhjxbo5Nz/Ysoxv1R2U2PYWgOlydheq5AtsM7apRgJY3R/wCRj+qz/Ar8p7YlTWyNBXWZj8ceV1gv/wCxj9rG0Xi/Y72+Lq3IutN1tacpz3BZdiU/zM9P7jCeprcIgg8TXcRvBSyU3dtsmzhSuwKPDbnqJuuMdQ7SpF5zn4pXlMrL49N386nr5aP7Q+IwinU47DLBEfgXXuAgqQ3IVsrrbWAtVIam7H4sw4nf19lt2x2ixd88hud/z6m/l/T+qjD4h8zDFRynrqspycV6HIir3IjcY67A+rDxKruMXg4deajHMbHSUjk9jn4WYt605Qs8f//EACARAAICAgIDAQEAAAAAAAAAAAABAhEQIBIhAzAxQVH/2gAIAQMBAT8Bv0ULDPw7OQmV6VmhrC0WlarFFaI+lCi2ONYr0rMCKHFMl4f4Sg0V6rIoWWiarrWh5o4kUMdikznRKVseywiRAqxwIxPIMe6P0b6IsjhOhq3Z5F2PCWKyh/bHhTH5RysjKvpOVvFbsiusosdbM44TL7ET6ZetMWLxyLeU6HK9as+D6GPasWKtZO8PFbXm6ws16JNilool5R//xAAhEQACAgEEAwEBAAAAAAAAAAAAAQIREBIgITEDMEFRcf/aAAgBAgEBPwGjt5eaGcYsZZZW2zUavzFlZUsVteGyJeKOBDW9s0iidcilYmWVsvd8JulQ2Ji8gpWL0N4TJ8j2Qdrb1h4ZYxI4HFGmyCpC2LDwyiQmayUjxlifoplNMkhiKOiDLw3RqOco/g8ShYvERVE0RWL/AAYiObItEu8VinvQpjmLk0jsj1isUddl/g8oj4n9F40hLDRpoWbwj5j6V6He2/VWKJx44I7LF1itvQ1mUS3ZrLx8P//EADcQAAEDAwIEBAQFBAEFAAAAAAEAAhEDEiExQRAiUWETIDJxBDBCkSNSgaGxFDNicsFAU9Hw8f/aAAgBAQAGPwIUnE3dTuiSnVOv8KJA8XbtwhaeTxHDlZ/KvnaI4VCOdzsnZRHM4wDOiM/iz1Qp0xDwYA0hGhWNG0Dlnqmt9Dm5Duyo1abMtMZGoT6mg4D7q7qnvUuKlg+6A9PZRj3UOwscG/imHdQnfDgy126ayYuMeyhsGlTFlPG3DKkL34Smg+5UmIKuGnC/0iNAjRqgBo3Cd4Za1s4uOCU4OOWmCqTRXio4RB3TKF7HBgyQN1TpgARnG/D34OPVBkS7VSNGom272Ci4wdey6bKCBhAnfKp0zy2y4hqdZNs4lErXPCXKEeFO7S6ShTouDh9Sp/Cu5Wu5SNF4bckfSELHWz0CDK1TOsuRewG15x0JXPDzrzbFBjQLr5IA1XiYdaEGxcTlTwHCndVIA1nQBF9F7lusFTPPuZWYcOoQAUHRSx7mPOMLGg490G+Q1HaDA7plU8pdnuF4lV5dGE2wY9tUI+ytax97jAcRhUqLJq/028TJQvduHQvxabcS6WKjSF178wiWTuJ4TCypefZGNFb3QnTdE7BSKdxcy72CPhuxroubIAUWkAdUQ0lzW4DjusLGqzwldyp4U6Icxlm5RHiX9XdeEgpvxFQ3RgCPSnNIPL03KeLZdUcXSgZbIi46FW/DtMRMFGvZd4fU7q7Wc8A5+azzIzotI6qbRLObO6tdSioDJ6LPSSpaDA3hOgCHflUPD/Yqo6mSCG69UDGuizykcMbcfdAdVA4T0RcRLtcolYQ94Tn0ahdRDbXs3JUAuJ1M9U2XEOEfdPcKIcCIMGPdPr+EGPdoN+yqWUiXNEuJ3PFtElsDOUAT6jEoPsucMATuhe0SzZfhghznAABWtf7kJ9Rrmub6ROcqXO5uwTGjc9E2yqR7ptPEu78MrKnZRsp6caLCBUYRfUtOQn07LM/dE80nRNDGvk4E7lNqVNI+xVRzv79TAgKm8vmp6reiuKgOBKax8tZT9RVOj9dQXO9uBfgN0zutBjlkBBxMVHD3hFzusT1VlXbQpro5WaBP9ldTqCyMNKtMl07pznaUsN4FxHpw3hPABe6AjHADQTJPQBf1NWkRVrnlAbmzZeIy9o9Lruqq81OlYNXFPALnhsikW7nqpdTcPfOEajr42CljYIXVSWZ6hVA0u/E1lHxmw4/Yr3Tabagd+qDaeC4S5QhOYRdd6dlcTLig0uFreYotFN0onwm5VusnhAUKNlPGOFgIF+DPRN+MbDvAYQS3Q9l8OPXUdLuxeYRbyGu/E9Z7qmA3maI9z14R5Sx7QR0Vzealt2V7heBiEap427TlYTn26lShRgzOe6BoYx9S8PYdOvHCgKVjhbMo1zTJpt3VD4eWQB4jm99mpt+lElxO5JQY0+j+fLqvVxLXCQUKMz9Up102jEd0D5nuMkDc7Iu8SBtG6vdFztOGuFMqTxDumVJ3yU5tNjrR+If9Ux7nsbd+J3nZFw8N5ecuUnfzfSV6T+i9XBtb/tn9lSa2pc55yN1A8pcrmRzHqsj9As0yNlaHLssaLuo4BvVRuhTDiLtf9UbwLNcbL0RJlvlysKCsEhfS9YkdkWVBLSMp1UCG/SEQBMJ0aDyNZ1RtquYdddU6s8dmDqgagDaerVUJidoURwlTqSoRXunHrgIUxvqUGtw1ggDp5JdhQwrVZWPIC8lo2HVQy6SNDsi7Y+VuXOcTGqDalroMjsoeZd16p2PXy8fdeyLuBA9goV4tE6SVDxB8meGnlaHdULDIMr2QbGWhB3kugWsMZXKOAY3DaeZ4Rw7oMGiL7ZgQvZdlMlWOPl6qXYPG88OUrOCgeiZTp/XhQONxUfU7mWSi9xgBFz51kmEZTuuyheynjT5T4rzddKJROgHlxjhlBGm7NwhFpzbhSRyjK5rcdBCBPVPdMgYb28nhjZc3Mmta+AMkIULp7KlT5mhzMx1UqePuoQVpJhv7KMCcotPngIcPEAw/KLo0IXdG9x8T6QAo3OfI+oSMmOBrTy6kqpV/NogXvLg3SeA4z04G4EW6qm4+quS+ANGo5vYMXRuuUk+/nJ3XTh7Kow9lf0UdFddCbOsIgbJrG6uQGWlusosa48y8MGA/VF1/PMWq1SUeEofdScShcSXvVSs11oa22D+XorQLKbT4hH+aHlyoVzChOiIkco1XiBxJ/hMG7lbPL6oU9Uxk4nKc6XToJKLnOgbrxDiP2V7jruVn3XZWAmBzOVb4nwnObGANkB5aj3Fhh7WCD+pVWrVpCpy42gqlc5k1Jf3a0boNhv4pnuEB2+VjdNI6K2eFyALnHuTKtBXdyDdmonqpfhu6fBI8TH6KnSpuguy8RwyidypRcfSwXFMo3cjJgdzqvh2xi689ICrVT6qjBRbjvKAU+fVeoLBlQnvc2oWt3GgRcgOML2yp3QaE1omHIgZsEonhCjpwDAfXqjUOy8VhjwR91Spy6KbZd3eiei9/k68BSvIY7NqteLQ1viP6rxSxwkXSdIU5yY0RcpR6SpZTtJcMbYUk6p7mulrcA9U47vUdUBCJOAFlQAgBsF+qcT/sf+F1JUH1alHofls8YF7ZlwVRzrvAB/8AgVQNq2M0DYwm0Gi1rBcW9yvhqIEVCPEqfrojUxDce/AKV/TANy64ndMp7MC7NElaIQMBRlpGsLqiXadFywArDKuY1p91DuR37K3bb5ZfvongtJNxKMUmtIb1nKms4kep56p1Z+C8yrOmSi7RSqHwrPUOdzu52WoMblOqHU9E+q/9OE3BYytFzSpBWeMaj5TC4EX6KlQ5Q2gy3G5VKm50vLbnDog39SteYmP0QLxgZT3zz1DCbS+H0G/VZVarUBL3DlTv8hGnClSbJJY0uHcqGqZ4arKlqh3lz52tUj0sFrUxrpDTzPd0CefiQ59Ui4XHVEgQmtVW/FM0fFceg2CHxTnYax7i3oRgLoFTp6lzRUjsjaxoj8qDRsmNi7OnVUy8wGvzPk0WMjh3Vp+RHF/KL6ptB6BCmzX/AIX4Z9TTr3T6h1qYnonk7DCc46oOn+++2P8AFi5Yv+Ifb/79k4fm/ZGs6YdyNd1TviDINapYz/UDh4o1Zke6qODbnVBYDEx1PyJU+bqubBjCARI0Q6BVIdzEWf8AlPsy2YCt6JrR63Ok9gmN68ycWCG7JgJJazQdF7oUZ0H2VOkxpYygwU2jg1v1alWWWio8kO/N8mPOFI1RuGVgkIOicRjdHozmcQv9iu2iPSOACnYIPqem7Kc8/UZU/SEXHZUqYBLqHwwEf5vOP+hka8M6q13p/hFoP9xOerj9IlHvwc7TEIpghGdNysaDRRHqKpVZHjfEVfExtHyZ8t23XhCgqeHsrX7fsoB5S6SUR+Yyhb6V1CHvPCJ5QoGnBrW66KwCBSHhD5rBW9B/lGgWcv5RsnNcJj6uvCAJPbyw7IQs/ZRKMkaQEI6IzEIN2/ni2s7IZkDvsjOpMlf/xAAmEAEAAgICAgICAgMBAAAAAAABABEhMUFRYXGBoRCRscEg0fDh/9oACAEBAAE/IaIVr6ULCALYpxQ8D+kMjmeSP6ubMu5WqSgDQ5gjnQEu8TQShS5zzLsuKOncsKi3qDBpN4DuviMq6aP2y4LRWGP1EY/hwvzAYW3NvtB6qTsqBwuAwEV8+4FqO07mnP8A7E0XTFN2LWx9U0dTEp0dzAsHIIIqPIzLB9qiX7RdjZAAVY6/F0vu7Lgf9tGTs+pQeBv0dw7nAqmG35ZReGupYUfEQsMeeJujtfU1mA1AX4QnINfOza5LfJArqSh5p3EBSCPEe61QcL3M2cVztw7qkPyMGUsaMZpjWAdZfbzUYVtPCMVE2bCPtOV7hYPL6gqLviPZKwq4H1AG5dS9hDPorZKB57JjQNKVzBrBhl1LrWc0qzQoN4lYjYDaFEu0o8THacTAEvohN08GHMdPhglF+40C6vSOYPpZRnPBGxt8hXMvSDoy1MbkKez5jIXJNE8b4/CmU+qldBH4/wB0XiW1dgssIXUq1brmJVZ/ueEeNK38xdz58wVQqIIOwsvQeo2Bg7e4tafDUo3ZfKlYteFWFn7XIwSLQw1AswtnTTE4DgqAVrEbRczNWY1Fi3IaMzTu6h0EOvxC4HXj9JeIKoEDz7m1dhcFcyialB2ZhF//AIIqAzzbvh+IOi4JMHUNpmJU5P8AcDKk09+eZYQIjo9QYeO4h4yLIFUYlhqHymItd5IFoyWZUdqt5TBrZVTC54C2dHmUQzkwp8wcDy0VWTRCseQGSc/MW40dkTybYZybnQpEOXeRmQTmK1ZviU+VlxlxVvqWXfuNXRbEWbH7X8Ar/wCzFNaFPIzUehKF9XNHLdOceII+EBR/bM+8NYA/5crbkOXmBTHuB+4A0S8UdBCj5I+GiIKkU5pxmEOY9BzObwuYGMbZkFY8kpCbyBg8zKrQ0y6qXOcqMr/EV3KVXuL1xVB5JfZQviF+vBKjyDtKtdrRcFQ/UxangwQbdZ4Ma5YTVybvEAA6F88xAnqOAef3KMph2FWiU2Sv7ezxCuCHaOB3MoRy8OE6LYQTefFwqK1OBu+JtqAm+ZaQV/JzFkmDODlJQg5JYsr+pzL9eoVmFrUuv9wG4DhxuGuIq6iojw/MqUAUGaXGK7znTEyYmPbHMC9nqVR44BcItbK1pLF1r+YF+kwLQiBwfuXgA/8AD6j6RAHfxKWhvG96h6HK3f8AzsiYMK1GOFm8o+FxGGgyzkflDmWxC5PuXGy3u6tr5ht54hHUY1gVkN1C0YZRKlKB1juZ5LZ+hlcqQtPLuOsr/Q9suibaFytIFRyH+4uwsFVKjjqNX+AvYzPPMvOPmXfCWOfmWA0fzMsFNPmXkdjKqyZbgvaflwstLKPG2X38yphcGIHr4jKfZ5XHghOTX17HGLiQDoBlDMU48EVO4o9D4Slr4DKb6hZaHhgKzLF+hhqo2r1DlmjDMY49AefcQr2GD1xMc5LL7lrZSzjCFQ3cWGcDdpojx9HV2yuUYCZR8swlsbyfgC0EcaoXmZWNNY3BLfgggLdTXioaMq2y+4lrbUqO1+IYb4r2FAvg34jk28GkVnuiPK/cd3/Zjcw6XZ+SE5L8QRaocOgM3HLPlDFybcvp/wBx3WC+yytmVQ/v81D2HwgABQtQBtqm+IGgSlILrpxEQFeTKxxII5Ven43vggXDejrIwADNwCOFal84tcQa+ALfMzuLaYahYFRzh3s95+ITU+KjCeJfMyH8G9xApDOV5ac1cDpLDDmbcMZBT5I1kBYru2PlAIBB0l/5D0QmQUToRbd4UUNz4l3BLFBDVFGWZDuXLZjRBgr/AJjtR14jb5V2fzKglpvhEoGTF4cH1HLwL3d1/uLC2rM2q5RhgNN56m5mOVioNMUeYK5ffGegvhwzbEoirk8r/wBmZJbSU7WA9R/jjy3iBLhY7PyTbbgg0B4lu+pSKt62TALuBfAagNY0FM7Zc7wcTRNu31G3NueogCMH4ZqU36NOA1DhhvFzRK8JbUPhLlDiL2QpA+ZbBlAWhlAWH53EAdvLMBziHcAWF3Of+qCrBQalSpos/wAMHatbDqlKvD3IMrtzlzOGn21fPiMe1Y3VB71mBbG9yjlUswWEyzWqqCQ2d40SgsTS+pbSZfqJo3j6pUIoDD7gc7qUl0zNlfM4kdx7+80lEmyWanlrphVzczDhHEzLG1Vl5Jc3EW4tt9wreg8/4HkxRh6mNoAO0G8mJ/5cMVq7hXg3pfMbvLzuOVeSGL+kuqcJeJeiu58yE5ClkWnocxCi6qlI+Ztb5lt1xDWEara9R8h+YutzDwgzOQVMhjIROIOU4Cw1qzmOfvQuc0Wd0VNaZ64/C0uF1ncr5tywwWqPxlNp0j3K45mQERhwS2u19xUuD9wiYH5CzBrR28ylvRtiLMvHiZcPLH++LSYRMrCSvYQNtnjOodkcDUx41ZcG6j7pZmoNugVT3GhOVduYBTzVcnLcMgoMfhLHUVLQSyb2F5lDQW0e4DgHMPAqiW3KAskGzliCqOb0hFuyNxbOvcwXHfmrsZuvGiBgc3VQJWB1eCkIrENrEyCYSaWMzh+HqShhRUORRpuWlu1AEMEUqhsOOoFgwBdP8PrC9QhuqilxRHzdP7kxDRKBWXuJSigWKbIW8mLArEwbnFMsw6Q6N+5kHExq70v0lvdGC+ZoU48ynfEbimNdRK5lC1hN0XHkrMImfMRD/EQsbyO+Z/bIIETay+2XDFZ/LMqU4/8ABZ71C8kUC3ASns2ZwTBbLNXZcbs0D0/uLWDjENh1lmUNR2waXUhUN72xcSRWs5iKSwWqPBM5wyFaZdR49VBzmUI7qEJnXUvDMC8eZjrHuOvSnBa6lB5yngb/ACiOl/2lK3z5lSWGiXK7QWLxbtFEbchtIFFGtCKOAnPExNgw5DiHopAmYXZtlBhcbcxVgiRpdzPnWUC5Aobso53XH1GF+Yg6blD/ACFulLfXiUdqZ8zD1EW5jJ3I4t0TmKjVmQcyrUvUS/kGjiOTbs4gbTs+JeFB+2Nl3C0ZAXUtVUpyXGXlFzGniAguK8nsZ+w39TL3hrwQVQALo4lNY+Ux8D+4OZWC4euJsrN8RX6mwGv0al+SZTHgSKPJpuwLt7cRO4DwGIb+FFmiUH4VqpqeU3o6iM8MdCxsTgIfpHQMlt/qGm6Jict7nYhcBHNmYBBlXOFN33Md+XR6IGjKbG5SSGS34ErRCkuNW/1PjcSrtQQim+j1DDhc5wD0kJSfEVLUQG+Xr/ndQUXGXax/7qHyVfEsA4wzbcGJUvzuPAZ2MKzRjTMadcCb4lS4fzlxL+ajufLMiCwauZNo6ml0HP8AiWJtlzzFfIMPuY6JMDjENumQFwt8GCdCAr5RTwYywVeI2Us/SUvMhaPOCIFXecKtPtlRZpJVxnHRmcs03LljA+5QUvE0r8NoqhlDMgecOmC1DbG9UW4XNnhwZdEOAFeCFohwOEt02BmY+XEUTo+ZvVw6aeXmYJFt9MBQIYbE24NeouMukxmzjDEv71+eoctmFUVeXqD6S9SmKKbJBG9qXboTE5Rg8swZJQUhwMcS5ePwZwcTJLVmlrJnPMWy1ByEG5LSLsjUeyNsgIsMTzYdT6JYnlX9P6lzx2NvExZNZ+YSDLPGyj5ZhEHU/W+o+SuB5fxEujMbsnlBPlgshF8H3DAGxjMSXMcgn3HdrWiZKX0/1MF+Bco823tFaio/NwamTx+GC5e/cQppFf7mTiy4MmC4tHA5zcKiCdVvZplgXFiDg4P1HbLc+oPTWRZHtlItN7W4+BKCwZL0USnUfPAmzYr9e/mI06JZoEAdbRxg3WtxaVx6cRQRqtC5asjwQgT4V1LIfrmCmEucQ/AbmUDrRdzcZhSh+97jo1Pn9ZT3WKHLQQiq5RqyXGnxluo+JXy7v27zK+o/UAUMAGgXT6qIwS3z4M8Vw/3QzVQ3o97ibCb+pS733AaD4mmFnmOZM9S90PcuiSzyRSvmcEI/i5ePwuwKxRch1KrXOmiHayaGgu/+7iK8+MBrw68QqC6qVldtP9ysEfrWm/Yyo7By8Cz5XHiGrnCF7oJTMThw8/wQkE4dJgADrL+qThvwgtknqagSPmfvL80HxiW/sbIESt1C/wAMPEcs6nITmJ1nrMVqDaS6DNNQbOZh6WUajL9wqLYvwLX6haAomtmmf0TCW6g3FXLKvZmVrp+5jfadtWPi2JbD+Xz9faVQzQFis7mbQxjxiEgVsxdhT2/xLlxqWqU+kvqlml2/ZFWbmpeJtzKtsaf5lkXAjKTl+LmPWVAZu8JYGXRcXHhNGagoiFmVaKCAI1MVih/1iN/iUlVGDhE6uhp6Kl/KCbl/fcOQhwII2rNtS07VR9SxnZiASC67f4i5+pkFy8bjBFpHQivXfzCWS4y+5qWS5nO+EiQyS78i/ZLCIOZXkGcO5bNaac/My23EaJgx8GWdTNlJklMGLQaNUfQINMOMU5hY8gPE2mBR2b/ghHUpTqMrtbH+otaGZ4nMCENYfEJ4l1LuYhCHZPNzLpMEFhos+fxqnMsxGULYJbrSG9Ri+4BenIBFKmnZBVqor9yi6GT54hjZbwjYt5zMcS33yvlnUOGMKvay8lR+CVFphMoDtRXxFQy44p0/VBDtMMNxtLYFgx6uYQtnZKGWMxdIVYwxcVY8XjZCBS3KBpm9tYFCJgPMZX/EQE132t+p3QtWE6Xkp6l3tUmOM8zqW1lnGdTKib0woHbCsR4Lqt/dxu5cG5lZleSYNcwW5mEhni7xMlzBBFtK8dL8TJC/+gi9xqDAhDsjZY9UuLYdcjxCu2Mb6IrQqB2jLTmcWqCjQVoiKgkIKuKHUZFAFSsSoGNzj2nqBuFC2Dcg/tGFVsbtZ//aAAwDAQACAAMAAAAQ7RPSXiCg8O90Hu2AXDqJspEgQYwZvXY87DaA3q6ccnwoj18tPxtYhGw7abTcZe/enH1TGIKQd7RCCiDNYZeFvwbSZHuCCGt3GXp86WzDp8YjCCa5z1Gqk3JQR0o4iiCWaQrpH0Kr8hwKIVk5kKBLS/fY57x+x4g+a3TbCgIXwUgSXoeAw7ohWTcDcpdkVw3aJ1SJyIW3h9J9ICb/ABn7tlwTkl4H7x4yxvcUkD7KhPHgDnlwiJbGhTcoRIHxzjN2Yf/EAB4RAQEBAQADAQEBAAAAAAAAAAEAESEQMUFRIGFx/9oACAEBAAE/IaIVr6ULCALYpxQ8D+kMjmeSP6ubMu5WqSgDQ5gjnQEu8TQShS5zzLsuKOncsKi3qDBpN4DuviMq6aP2y4LRWGP1EY/hwvzAYW3NvtB6qTsqBwuAwEV8+4FqO07mnP8A7E0XTFN2LWx9U0dTEp0dzAsHIIIqPIzLB9qiX7RdjZAAVY6/F0vu7Lgf9tGTs+pQeBv0dw7nAqmG35ZReGupYUfEQsMeeJujtfU1mA1AX4QnINfOza5LfJArqSh5p3EBSCPEe61QcL3M2cVztw7qkPyMGUsaMZpjWAdZfbzUYVtPCMVE2bCPtOV7hYPL6gqLviPZKwq4H1AG5dS9hDPorZKB57JjQNKVzBrBhl1LrWc0qzQoN4lYjYDaFEu0o8THacTAEvohN08GHMdPhglF+40C6vSOYPpZRnPBGxt8hXMvSDoy1MbkKez5jIXJNE8b4/CmU+qldBH4/wB0XiW1dgssIXUq1brmJVZ/ueEeNK38xdz58wVQqIIOwsvQeo2Bg7e4tafDUo3ZfKlYteFWFn7XIwSLQw1AswtnTTE4DgqAVrEbRczNWY1Fi3IaMzTu6h0EOvxC4HXj9JeIKoEDz7m1dhcFcyialB2ZhF//AIIqAzzbvh+IOi4JMHUNpmJU5P8AcDKk09+eZYQIjo9QYeO4h4yLIFUYlhqHymItd5IFoyWZUdqt5TBrZVTC54C2dHmUQzkwp8wcDy0VWTRCseQGSc/MW40dkTybYZybnQpEOXeRmQTmK1ZviU+VlxlxVvqWXfuNXRbEWbH7X8Ar/wCzFNaFPIzUehKF9XNHLdOceII+EBR/bM+8NYA/5crbkOXmBTHuB+4A0S8UdBCj5I+GiIKkU5pxmEOY9BzObwuYGMbZkFY8kpCbyBg8zKrQ0y6qXOcqMr/EV3KVXuL1xVB5JfZQviF+vBKjyDtKtdrRcFQ/UxangwQbdZ4Ma5YTVybvEAA6F88xAnqOAef3KMph2FWiU2Sv7ezxCuCHaOB3MoRy8OE6LYQTefFwqK1OBu+JtqAm+ZaQV/JzFkmDODlJQg5JYsr+pzL9eoVmFrUuv9wG4DhxuGuIq6iojw/MqUAUGaXGK7znTEyYmPbHMC9nqVR44BcItbK1pLF1r+YF+kwLQiBwfuXgA/8AD6j6RAHfxKWhvG96h6HK3f8AzsiYMK1GOFm8o+FxGGgyzkflDmWxC5PuXGy3u6tr5ht54hHUY1gVkN1C0YZRKlKB1juZ5LZ+hlcqQtPLuOsr/Q9suibaFytIFRyH+4uwsFVKjjqNX+AvYzPPMvOPmXfCWOfmWA0fzMsFNPmXkdjKqyZbgvaflwstLKPG2X38yphcGIHr4jKfZ5XHghOTX17HGLiQDoBlDMU48EVO4o9D4Slr4DKb6hZaHhgKzLF+hhqo2r1DlmjDMY49AefcQr2GD1xMc5LL7lrZSzjCFQ3cWGcDdpojx9HV2yuUYCZR8swlsbyfgC0EcaoXmZWNNY3BLfgggLdTXioaMq2y+4lrbUqO1+IYb4r2FAvg34jk28GkVnuiPK/cd3/Zjcw6XZ+SE5L8QRaocOgM3HLPlDFybcvp/wBx3WC+yytmVQ/v81D2HwgABQtQBtqm+IGgSlILrpxEQFeTKxxII5Ven43vggXDejrIwADNwCOFal84tcQa+ALfMzuLaYahYFRzh3s95+ITU+KjCeJfMyH8G9xApDOV5ac1cDpLDDmbcMZBT5I1kBYru2PlAIBB0l/5D0QmQUToRbd4UUNz4l3BLFBDVFGWZDuXLZjRBgr/AJjtR14jb5V2fzKglpvhEoGTF4cH1HLwL3d1/uLC2rM2q5RhgNN56m5mOVioNMUeYK5ffGegvhwzbEoirk8r/wBmZJbSU7WA9R/jjy3iBLhY7PyTbbgg0B4lu+pSKt62TALuBfAagNY0FM7Zc7wcTRNu31G3NueogCMH4ZqU36NOA1DhhvFzRK8JbUPhLlDiL2QpA+ZbBlAWhlAWH53EAdvLMBziHcAWF3Of+qCrBQalSpos/wAMHatbDqlKvD3IMrtzlzOGn21fPiMe1Y3VB71mBbG9yjlUswWEyzWqqCQ2d40SgsTS+pbSZfqJo3j6pUIoDD7gc7qUl0zNlfM4kdx7+80lEmyWanlrphVzczDhHEzLG1Vl5Jc3EW4tt9wreg8/4HkxRh6mNoAO0G8mJ/5cMVq7hXg3pfMbvLzuOVeSGL+kuqcJeJeiu58yE5ClkWnocxCi6qlI+Ztb5lt1xDWEara9R8h+YutzDwgzOQVMhjIROIOU4Cw1qzmOfvQuc0Wd0VNaZ64/C0uF1ncr5tywwWqPxlNp0j3K45mQERhwS2u19xUuD9wiYH5CzBrR28ylvRtiLMvHiZcPLH++LSYRMrCSvYQNtnjOodkcDUx41ZcG6j7pZmoNugVT3GhOVduYBTzVcnLcMgoMfhLHUVLQSyb2F5lDQW0e4DgHMPAqiW3KAskGzliCqOb0hFuyNxbOvcwXHfmrsZuvGiBgc3VQJWB1eCkIrENrEyCYSaWMzh+HqShhRUORRpuWlu1AEMEUqhsOOoFgwBdP8PrC9QhuqilxRHzdP7kxDRKBWXuJSigWKbIW8mLArEwbnFMsw6Q6N+5kHExq70v0lvdGC+ZoU48ynfEbimNdRK5lC1hN0XHkrIImfMRD/EQsbyO+Z/bIIETay+2XDFZ/LMqU4/8ABZ71C8kUC3ASns2ZwTBbLNXZcbs0D0/uLWDjENh1lmUNR2waXUhUN72xcSRWs5iKSwWqPBM5wyFaZdR49VBzmUI7qEJnXUvDMC8eZjrHuOvSnBa6lB5yngb/ACiOl/2lK3z5lSWGiXK7QWLxbtFEbchtIFFGtCKOAnPExNgw5DiHopAmYXZtlBhcbcxVgiRpdzPnWUC5Aobso53XH1GF+Yg6blD/ACFulLfXiUdqZ8zD1EW5jJ3I4t0TmKjVmQcyrUvUS/kGjiOTbs4gbTs+JeFB+2Nl3C0ZAXUtVUpyXGXlFzGniAguK8nsZ+w39TL3hrwQVQALo4lNY+Ux8D+4OZWC4euJsrN8RX6mwGv0al+SZTHgSKPJpuwLt7cRO4DwGIb+FFmiUH4VqpqeU3o6iM8MdCxsTgIfpHQMlt/qGm6Jict7nYhcBHNmYBBlXOFN33Md+XR6IGjKbG5SSGS34ErRCkuNW/1PjcSrtQQim+j1DDhc5wD0kJSfEVLUQG+Xr/ndQUXGXax/7qHyVfEsA4wzbcGJUvzuPAZ2MKzRjTMadcCb4lS4fzlxL+ajufLMiCwauZNo6ml0HP8AiWJtlzzFfIMPuY6JMDjENumQFwt8GCdCAr5RTwYywVeI2Us/SUvMhaPOCIFXecKtPtlRZpJVxnHRmcs03LljA+5QUvE0r8NoqhlDMgecOmC1DbG9UW4XNnhwZdEOAFeCFohwOEt02BmY+XEUTo+ZvVw6aeXmYJFt9MBQIYbE24NeouMukxmzjDEv71+eoctmFUVeXqD6S9SmKKbJBG9qXboTE5Rg8swZJQUhwMcS5ePwZwcTJLVmlrJnPMWy1ByEG5LSLsjUeyNsgIsMTzYdT6JYnlX9P6lzx2NvExZNZ+YSDLPGyj5ZhEHU/W+o+SuB5fxEujMbsnlBPlgshF8H3DAGxjMSXMcgn3HdrWiZKX0/1MF+Bco823tFaio/NwamTx+GC5e/cQppFf7mTiy4MmC4tHA5zcKiCdVvZplgXFiDg4P1HbLc+oPTWRZHtlItN7W4+BKCwZL0USnUfPAmzYr9e/mI06JZoEAdbRxg3WtxaVx6cRQRqtC5asjwQgT4V1LIfrmCmEucQ/AbmUDrRdzcZhSh+97jo1Pn9ZT3WKHLQQiq5RqyXGnxluo+JXy7v27zK+o/UAUMAGgXT6qIwS3z4M8Vw/3QzVQ3o97ibCb+pS733AaD4mmFnmOZM9S90PcuiSzyRSvmcEI/i5ePwuwKxRch1KrXOmiHayaGgu/+7iK8+MBrw68QqC6qVldtP9ysEfrWm/Yyo7By8Cz5XHiGrnCF7oJTMThw8/wQkE4dJgADrL+qThvwgtknqagSPmfvL80HxiW/sbIESt1C/wAMPEcs6nITmJ1nrMVqDaS6DNNQbOZh6WUajL9wqLYvwLX6haAomtmmf0TCW6g3FXLKvZmVrp+5jfadtWPi2JbD+Xz9faVQzQFis7mbQxjxiEgVsxdhT2/xLlxqWqU+kvqlml2/ZFWbmpeJtzKtsaf5lkXAjKTl+LmPWVAZu8JYGXRcXHhNGagoiFmVaKCAI1MVih/1iN/iUlVGDhE6uhp6Kl/KCbl/fcOQhwII2rNtS07VR9SxnZiASC67f4i5+pkFy8bjBFpHQivXfzCWS4y+5qWS5nO+EiQyS78i/ZLCIOZXkGcO5bNaac/My23EaJgx8GWdTNlJklMGLQaNUfQINMOMU5hY8gPE2mBR2b/ghHUpTqMrtbH+otaGZ4nMCENYfEJ4l1LuYhCHZPNzLpMEFhos+fxqnMsxGULYJbrSG9Ri+4BenIBFKmnZBVqor9yi6GT54hjZbwjYt5zMcS33yvlnUOGMKvay8lR+CVFphMoDtRXxFQy44p0/VBDtMMNxtLYFgx6uYQtnZKGWMxdIVYwxcVY8XjZCBS3KBpm9tYFCJgPMZX/EQE132t+p3QtWE6Xkp6l3tUmOM8zqW1lnGdTKib0woHbCsR4Lqt/dxu5cG5lZleSYNcwW5mEhni7xMlzBBFtK8dL8TJC/+gi9xqDAhDsjZY9UuLYdcjxCu2Mb6IrQqB2jLTmcWqCjQVoiKgkIKuKHUZFAFSsSoGNzj2nqBuFC2Dcg/tGFVsbtZ//aAAwDAQACAAMAAAAQ7RPSXiCg8O90Hu2AXDqJspEgQYwZvXY87DaA3q6ccnwoj18tPxtYhGw7abTcZe/enH1TGIKQd7RCCiDNYZeFvwbSZHuCCGt3GXp86WzDp8YjCCa5z1Gqk3JQR0o4iiCWaQrpH0Kr8hwKIVk5kKBLS/fY57x+x4g+a3TbCgIXwUgSXoeAw7ohWTcDcpdkVw3aJ1SJyIW3h9J9ICb/ABn7tlwTkl4H7x4yxvcUkD7KhPHgDnlwiJbGhTcoRIHxzjN2Yf/EAB4RAQEBAQADAQEBAAAAAAAAAAEAESEQMUFRIGFx/9oACAQEA'

const catalogLyrics = [
  { text: "Just 'cause you feel it doesn't mean it's there.", song: "Weird Fishes/Arpeggi", artist: "Radiohead" },
  { text: "When the sun hits.", song: "When the Sun Hits", artist: "Slowdive" },
  { text: "I wanna be forgotten.", song: "You Only Live Once", artist: "The Strokes" },
]

const initialAlbums: Album[] = [
  { id: 1, title: 'The New Abnormal', artist: 'The Strokes', year: 2020, genre: 'Indie rock', cover: 'cover-strokes', coverLabel: 'TNA', myRating: 5, hisRating: 4.5, mine: true, his: true, listenedByMe: true, listenedByHim: true, note: 'An album that keeps revealing new details.' },
  { id: 2, title: 'In Rainbows', artist: 'Radiohead', year: 2007, genre: 'Art rock', cover: 'cover-rainbows', coverLabel: 'IN\nRAINBOWS', myRating: 5, hisRating: 4.5, mine: true, his: true, listenedByMe: true, listenedByHim: true, note: 'Weird Fishes deserves its own little universe.' },
  { id: 3, title: 'Souvlaki', artist: 'Slowdive', year: 1993, genre: 'Shoegaze', cover: 'cover-souvlaki', coverLabel: 'SOUVLAKI', myRating: 4.5, mine: true, his: false, listenedByMe: true, listenedByHim: false },
  { id: 4, title: 'Romance', artist: 'Fontaines D.C.', year: 2024, genre: 'Post-punk', cover: 'cover-romance', coverLabel: 'ROMANCE', hisRating: 4.5, mine: false, his: true, listenedByMe: false, listenedByHim: true, recommendedBy: 'him' },
  { id: 5, title: 'Bloom', artist: 'Beach House', year: 2012, genre: 'Dream pop', cover: 'cover-bloom', coverLabel: 'BLOOM', myRating: 4.5, hisRating: 4, mine: true, his: true, listenedByMe: true, listenedByHim: true },
  { id: 6, title: 'Polygondwanaland', artist: 'King Gizzard & The Lizard Wizard', year: 2017, genre: 'Psychedelic rock', cover: 'cover-poly', coverLabel: 'POLYGON\nDWANALAND', myRating: 4, mine: true, his: false, listenedByMe: true, listenedByHim: false },
  { id: 7, title: 'D E A T H M E T A L', artist: 'Panchiko', year: 2000, genre: 'Indie rock', cover: 'cover-panchiko', coverLabel: 'D E A T H\nM E T A L', mine: false, his: true, listenedByMe: false, listenedByHim: true, recommendedBy: 'him' },
  { id: 8, title: 'Is This It', artist: 'The Strokes', year: 2001, genre: 'Garage rock', cover: 'cover-isthisit', coverLabel: 'IS THIS IT', myRating: 4.5, mine: true, his: false, listenedByMe: true, listenedByHim: false },
  { id: 9, title: 'Heaven or Las Vegas', artist: 'Cocteau Twins', year: 1990, genre: 'Dream pop', cover: 'cover-heaven', coverLabel: 'HEAVEN OR\nLAS VEGAS', mine: false, his: true, listenedByMe: false, listenedByHim: false, recommendedBy: 'him' },
]

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'my-library', label: 'My library', icon: 'library' },
  { id: 'his-library', label: 'His library', icon: 'user' },
  { id: 'recommendations', label: 'Recommendations', icon: 'send' },
  { id: 'our-collection', label: 'Our collection', icon: 'disc' },
]

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const shapes: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    library: <><path d="M4 4.5h15a1 1 0 0 1 1 1V20H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" /><path d="M7 8h9M7 12h9M7 16h5" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5" /></>,
    send: <><path d="m21 3-7.5 18-3.8-7.7L2 9.5 21 3Z" /><path d="M9.7 13.3 21 3" /></>,
    disc: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.2" /><path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    shuffle: <><path d="m16 3 5 5-5 5M4 7h3c5 0 5 10 10 10h4M16 16l5 5-5-5" /><path d="M4 17h3c1.5 0 2.5-1 3.4-2.5M14 7.5c.9-1.5 1.9-2.5 3-2.5h4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-7" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...common}>{shapes[name] ?? shapes.disc}</svg>
}

function Artwork({ album, large = false }: { album: Album; large?: boolean }) {
  return (
    <div className={`artwork ${album.cover} ${large ? 'artwork-large' : ''}`} aria-label={`${album.title} artwork placeholder`}>
      <span className="artwork-grain" />
      <span className="artwork-label">{album.coverLabel}</span>
      <span className="artwork-caption">{album.artist}</span>
    </div>
  )
}

function Rating({ value }: { value?: number }) {
  if (value === undefined) return <span className="rating-empty">Not rated</span>
  return <span className="rating"><span className="rating-star">★</span> {value.toFixed(1).replace('.0', '')}</span>
}

function AlbumCard({ album, onSelect }: { album: Album; onSelect: (album: Album) => void }) {
  return (
    <button className="album-card" onClick={() => onSelect(album)} type="button">
      <Artwork album={album} />
      <span className="album-card-title">{album.title}</span>
      <span className="album-card-artist">{album.artist}</span>
      <span className="album-card-meta"><Rating value={album.myRating} /><span>{album.year}</span></span>
    </button>
  )
}

function App() {
  const [selectedUser, setSelectedUser] = useState<'Matheus' | 'Thiago' | null>(() => {
    try {
      const saved = window.localStorage.getItem('lado-ab-user')
      return saved === 'Matheus' || saved === 'Thiago' ? saved : null
    } catch { return null }
  })
  const [page, setPage] = useState<Page>('home')
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All albums')
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [randomAlbum, setRandomAlbum] = useState<Album | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try { return window.localStorage.getItem('lado-ab-theme') === 'dark' } catch { return false }
  })
  const [featuredLyric] = useState(() => catalogLyrics[Math.floor(Math.random() * catalogLyrics.length)])

  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const pageTitle = navItems.find((item) => item.id === page)?.label ?? (page === 'collections' ? 'Collections' : 'Statistics')

  const visibleAlbums = useMemo(() => {
    let result = albums
    if (page === 'my-library') result = result.filter((album) => album.mine)
    if (page === 'his-library') result = result.filter((album) => album.his)
    if (page === 'our-collection') result = result.filter((album) => album.mine && album.his)
    if (filter === 'Listened') result = result.filter((album) => page === 'his-library' ? album.listenedByHim : album.listenedByMe)
    if (filter === 'Unlistened') result = result.filter((album) => page === 'his-library' ? !album.listenedByHim : !album.listenedByMe)
    if (filter === 'Rated') result = result.filter((album) => page === 'his-library' ? album.hisRating !== undefined : album.myRating !== undefined)
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((album) => `${album.title} ${album.artist} ${album.genre}`.toLowerCase().includes(query))
    }
    return result
  }, [albums, filter, page, search])

  const navigate = (next: Page) => {
    setPage(next)
    setSearch('')
    setFilter('All albums')
    setSelectedAlbum(null)
    setMobileNavOpen(false)
  }

  const pickRandomAlbum = () => {
    const unheardByBoth = albums.filter((album) => !album.listenedByMe && !album.listenedByHim)
    const unheardByMe = albums.filter((album) => !album.listenedByMe)
    const choices = unheardByBoth.length ? unheardByBoth : unheardByMe.length ? unheardByMe : albums
    setRandomAlbum(choices[Math.floor(Math.random() * choices.length)])
  }

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current
      try { window.localStorage.setItem('lado-ab-theme', next ? 'dark' : 'light') } catch { /* storage may be unavailable */ }
      return next
    })
  }

  const addAlbum = (album: Album) => {
    setAlbums((current) => current.map((item) => item.id === album.id ? { ...item, mine: true } : item))
    setShowAdd(false)
    setToast(`“${album.title}” added to your library`)
    window.setTimeout(() => setToast(''), 2800)
  }

  const renderLibrary = () => (
    <>
      <div className="page-heading-row">
        <div><p className="eyebrow">THE RECORD SHELF</p><h1>{pageTitle}</h1><p className="page-intro">{page === 'our-collection' ? 'The records that have found a home on both sides.' : 'A growing collection of records worth keeping.'}</p></div>
        <button className="button button-dark" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} /> Add an album</button>
      </div>
      <div className="library-toolbar">
        <label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search albums, artists, genres..." /></label>
        <div className="filter-pills">{['All albums', 'Listened', 'Unlistened', 'Rated'].map((item) => <button key={item} className={filter === item ? 'filter-pill active' : 'filter-pill'} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      <div className="results-line"><span>{visibleAlbums.length} RECORDS</span><span>Recently added <span aria-hidden="true">⌄</span></span></div>
      {visibleAlbums.length ? <div className="album-grid">{visibleAlbums.map((album) => <AlbumCard key={album.id} album={album} onSelect={setSelectedAlbum} />)}</div> : <div className="empty-state"><p>No records found.</p><span>Try another search or filter.</span></div>}
    </>
  )

  const chooseUser = (user: 'Matheus' | 'Thiago') => {
    setSelectedUser(user)
    try { window.localStorage.setItem('lado-ab-user', user) } catch { /* storage may be unavailable */ }
  }

  const switchUser = () => {
    setSelectedUser(null)
    try { window.localStorage.removeItem('lado-ab-user') } catch { /* storage may be unavailable */ }
  }

  if (!selectedUser) {
    return (
      <div className={darkMode ? 'app-shell dark-mode profile-screen' : 'app-shell profile-screen'}>
        <div className="profile-picker">
          <div className="profile-brand">
            <span className="brand-mark"><span>A</span><i>/</i><span>B</span></span>
            <span className="brand-name">Lado A <span>/</span> Lado B</span>
            <span className="brand-caption">A SHARED MUSIC ARCHIVE</span>
          </div>
          <p className="eyebrow">TWO SIDES, ONE COLLECTION</p>
          <h1>Who's listening<br /><em>today?</em></h1>
          <p className="profile-intro">Choose your profile to step into the archive.</p>
          <div className="profile-options">
            {(['Matheus', 'Thiago'] as const).map((user, index) => (
              <button className="profile-card" key={user} onClick={() => chooseUser(user)} type="button">
                <span className={index === 0 ? 'profile-avatar profile-avatar-matheus profile-avatar-photo' : 'profile-avatar profile-avatar-thiago'}>{user === 'Matheus' ? <img src={matheusAvatar} alt="" /> : <img src={thiagoAvatar} alt="" />}</span>
                <span className="profile-card-name">{user}</span>
                <span className="profile-card-caption">{index === 0 ? 'SIDE A' : 'SIDE B'}</span>
                <span className="profile-card-arrow"><Icon name="arrow" size={18} /></span>
              </button>
            ))}
          </div>
          <span className="profile-footer">A LITTLE SPACE FOR THE MUSIC YOU SHARE.</span>
        </div>
        <button className="profile-theme-toggle theme-toggle" onClick={toggleTheme} type="button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}><Icon name={darkMode ? 'sun' : 'moon'} size={18} /></button>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'app-shell dark-mode' : 'app-shell'}>
      <aside className={mobileNavOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <button className="brand-lockup" onClick={() => navigate('home')} type="button">
          <span className="brand-mark"><span>A</span><i>/</i><span>B</span></span>
          <span className="brand-name">Lado A <span>/</span> Lado B</span>
          <span className="brand-caption">A SHARED MUSIC ARCHIVE</span>
        </button>
        <div className="sidebar-rule" />
        <p className="nav-label">YOUR ARCHIVE</p>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={page === item.id ? 'nav-item active' : 'nav-item'} onClick={() => navigate(item.id)}><Icon name={item.icon} size={18} /><span>{item.label}</span>{item.id === 'recommendations' && <span className="nav-count">3</span>}</button>)}
        </nav>
        <p className="nav-label secondary-nav-label">MORE TO EXPLORE</p>
        <nav className="main-nav" aria-label="More navigation">
          <button className={page === 'collections' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('collections')}><Icon name="grid" size={18} /><span>Collections</span></button>
          <button className={page === 'stats' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('stats')}><Icon name="chart" size={18} /><span>Statistics</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="side-note"><span className="side-note-mark">✳</span><p>Good records are<br /><em>better when shared.</em></p></div>
          <span className="sidebar-foot">EST. IN GOOD TASTE · 2026</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation"><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>THE ARCHIVE</span><span className="breadcrumb-slash">/</span><strong>{pageTitle.toUpperCase()}</strong></div>
          <div className="topbar-actions"><span className="today-label">{today}</span><button className="profile-switch" onClick={switchUser} type="button" title="Switch profile"><span className={selectedUser === 'Matheus' ? 'profile-avatar profile-avatar-mini profile-avatar-photo' : 'profile-avatar profile-avatar-mini'}>{selectedUser === 'Matheus' ? <img src={matheusAvatar} alt="" /> : <img src={thiagoAvatar} alt="" />}</span><span>{selectedUser}</span></button><button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}><Icon name={darkMode ? 'sun' : 'moon'} size={18} /></button><button className="button button-outline top-add" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} /> Add album</button></div>
        </header>

        <div className="page-content">
          {page === 'home' && (
            <>
              <section className="home-intro">
                <div><p className="eyebrow">{today.toUpperCase()} · A NOTE FROM THE ARCHIVE</p><h1>Good music<br /><em>travels between us.</em></h1><p className="home-lede">A living collection of albums we find, pass along, and come back to.</p></div>
                <div className="intro-actions"><button className="button button-dark" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} /> Add an album</button><button className="button button-text" onClick={pickRandomAlbum}><Icon name="shuffle" size={16} /> Surprise me</button></div>
                <span className="intro-stamp">SIDE A<br /><b>✳</b><br />SIDE B</span>
              </section>

              <section className="overview-strip">
                <div><span className="metric-number">{albums.length.toString().padStart(2, '0')}</span><span className="metric-label">ALBUMS IN THE ARCHIVE</span></div>
                <div><span className="metric-number">{albums.filter((album) => album.mine && album.his).length.toString().padStart(2, '0')}</span><span className="metric-label">ON BOTH SHELVES</span></div>
                <div><span className="metric-number">{albums.filter((album) => album.recommendedBy).length.toString().padStart(2, '0')}</span><span className="metric-label">RECOMMENDATIONS</span></div>
                <div><span className="metric-number">{albums.filter((album) => album.listenedByMe && album.listenedByHim).length.toString().padStart(2, '0')}</span><span className="metric-label">LISTENED TOGETHER</span></div>
              </section>

              <div className="home-columns">
                <section className="home-section waiting-section">
                  <div className="section-heading"><div><p className="eyebrow">THE NEXT LISTEN</p><h2>Waiting for you</h2></div><button className="text-link" onClick={() => navigate('recommendations')}>All recommendations <Icon name="arrow" size={14} /></button></div>
                  <div className="recommendation-feature">
                    <Artwork album={albums[6]} large />
                    <div className="recommendation-copy"><span className="status-label"><i /> JUST IN · FROM HIM</span><h3>{albums[6].title}</h3><p className="muted">{albums[6].artist} · {albums[6].year}</p><blockquote>“I think this is right up your alley.”</blockquote><button className="button button-dark button-small" onClick={() => setSelectedAlbum(albums[6])}>Open recommendation <Icon name="arrow" size={14} /></button></div>
                  </div>
                  <div className="section-heading activity-heading"><div><p className="eyebrow">LITTLE BY LITTLE</p><h2>Recent activity</h2></div><span className="quiet-label">A SHARED TIMELINE</span></div>
                  <div className="activity-list">
                    <div className="activity-item"><Artwork album={albums[0]} /><div><p><strong>He rated</strong> The New Abnormal</p><span>Yesterday · 4.5 stars</span></div><Rating value={4.5} /></div>
                    <div className="activity-item"><Artwork album={albums[4]} /><div><p><strong>You added</strong> Bloom</p><span>2 days ago · To your library</span></div><span className="activity-dot" /></div>
                    <div className="activity-item"><Artwork album={albums[1]} /><div><p><strong>You both listened</strong> to In Rainbows</p><span>Last week · A shared favorite</span></div><span className="activity-dot" /></div>
                  </div>
                </section>

                <aside className="home-aside">
                  <section className="aside-section">
                    <div className="section-heading"><div><p className="eyebrow">FRESH ON THE SHELF</p><h2>Recently added</h2></div><button className="icon-link" onClick={() => navigate('my-library')} aria-label="Open library"><Icon name="arrow" /></button></div>
                    {[albums[5], albums[4], albums[1]].map((album, index) => <button className="recent-album" key={album.id} onClick={() => setSelectedAlbum(album)}><Artwork album={album} /><span className="recent-copy"><strong>{album.title}</strong><small>{album.artist}</small><small className="recent-added">{index === 0 ? 'ADDED BY YOU' : index === 1 ? 'ADDED BY HIM' : 'IN BOTH LIBRARIES'}</small></span><Icon name="arrow" size={15} /></button>)}
                  </section>
                  <section className="random-card">
                    <span className="random-ornament">✳</span><p className="eyebrow">NEED A PLACE TO START?</p><h2>Let the records<br /><em>decide.</em></h2><p>Pick something neither of you has heard yet.</p><button className="button button-light" onClick={pickRandomAlbum}><Icon name="shuffle" size={16} /> Find a random album</button>
                  </section>
                  <section className="aside-note"><span>“</span><p>{featuredLyric.text}</p><small>— {featuredLyric.song.toUpperCase()} · {featuredLyric.artist.toUpperCase()}</small></section>
                </aside>
              </div>
            </>
          )}

          {(page === 'my-library' || page === 'his-library' || page === 'our-collection') && renderLibrary()}

          {page === 'recommendations' && (
            <section className="subpage"><p className="eyebrow">MUSIC, PASSED BACK AND FORTH</p><h1>Recommendations</h1><p className="page-intro">Albums with a little message attached. Some are still waiting for their moment.</p><div className="recommendation-list">{albums.filter((album) => album.recommendedBy).map((album) => <button className="recommendation-row" key={album.id} onClick={() => setSelectedAlbum(album)}><Artwork album={album} /><span className="recommendation-row-copy"><strong>{album.title}</strong><small>{album.artist}</small><small>Recommended {album.recommendedBy === 'him' ? 'by him to you' : 'by you to him'}</small></span><span className={album.listenedByMe ? 'tag tag-done' : 'tag tag-pending'}>{album.listenedByMe ? 'Listened' : 'Waiting'}</span><Icon name="arrow" size={16} /></button>)}</div></section>
          )}

          {page === 'collections' && (
            <section className="subpage"><p className="eyebrow">A RECORD FOR EVERY MOOD</p><h1>Collections</h1><p className="page-intro">Little shelves within the bigger one. Gather albums around a feeling, a memory, or a passing obsession.</p><div className="collection-grid"><button className="collection-card collection-one" onClick={() => navigate('our-collection')}><span>01 / SHARED</span><h2>On repeat,<br /><em>together.</em></h2><small>Albums we've both spent time with</small></button><button className="collection-card collection-two" onClick={() => navigate('my-library')}><span>02 / YOUR SIDE</span><h2>Personal<br /><em>favorites.</em></h2><small>The records that stay with you</small></button><button className="collection-card collection-three" onClick={() => navigate('recommendations')}><span>03 / TO EXPLORE</span><h2>For a rainy<br /><em>afternoon.</em></h2><small>Things waiting to be discovered</small></button></div></section>
          )}

          {page === 'stats' && (
            <section className="subpage"><p className="eyebrow">THE NUMBERS BEHIND THE NOISE</p><h1>By the numbers</h1><p className="page-intro">A few patterns from the music we've been sharing.</p><div className="stats-grid"><div className="stat-card"><span>ALBUMS CATALOGED</span><strong>{albums.length}</strong><small>Across both libraries</small></div><div className="stat-card"><span>SHARED ALBUMS</span><strong>{albums.filter((album) => album.mine && album.his).length}</strong><small>On both shelves</small></div><div className="stat-card"><span>AVERAGE YOUR RATING</span><strong>4.6</strong><small>Out of 5 stars</small></div><div className="stat-card"><span>AVERAGE HIS RATING</span><strong>4.4</strong><small>Out of 5 stars</small></div></div><div className="genre-panel"><div className="section-heading"><div><p className="eyebrow">A SHARED SOUND</p><h2>Genres in the archive</h2></div></div>{[['Indie rock',82],['Art rock',66],['Dream pop',52],['Shoegaze',38],['Post-punk',29]].map(([genre, value]) => <div className="genre-row" key={genre as string}><span>{genre}</span><div className="genre-track"><i style={{ width: `${value}%` }} /></div><small>{value}%</small></div>)}</div></section>
          )}
        </div>
        <footer className="page-footer"><span>LADO A / LADO B</span><span>MADE OF MUSIC & MEMORY</span><span>VOL. 01 — 2026</span></footer>
      </main>

      {(selectedAlbum || randomAlbum || showAdd) && (
        <div className="modal-backdrop" onClick={() => { setSelectedAlbum(null); setRandomAlbum(null); setShowAdd(false) }}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelectedAlbum(null); setRandomAlbum(null); setShowAdd(false) }} aria-label="Close"><Icon name="close" /></button>
            {selectedAlbum && <><Artwork album={selectedAlbum} large /><p className="eyebrow modal-eyebrow">FROM THE ARCHIVE · {selectedAlbum.year}</p><h2>{selectedAlbum.title}</h2><p className="muted">{selectedAlbum.artist} · {selectedAlbum.genre}</p><div className="modal-ratings"><div><small>YOUR RATING</small><Rating value={selectedAlbum.myRating} /></div><div><small>HIS RATING</small><Rating value={selectedAlbum.hisRating} /></div></div><p className="modal-note">{selectedAlbum.note ?? 'No notes yet. A good place to remember what this album means to you.'}</p><button className="button button-dark modal-action" onClick={() => { setSelectedAlbum(null); setToast('Album details are ready for the next development phase.'); window.setTimeout(() => setToast(''), 2800) }}>Back to the archive</button></>}
            {randomAlbum && <><p className="eyebrow modal-eyebrow">THE RECORDS HAVE DECIDED</p><Artwork album={randomAlbum} large /><h2>{randomAlbum.title}</h2><p className="muted">{randomAlbum.artist} · {randomAlbum.year}</p><p className="modal-note">A little nudge toward something new. Give this one a spin.</p><button className="button button-dark modal-action" onClick={() => { setSelectedAlbum(randomAlbum); setRandomAlbum(null) }}>Take a closer look <Icon name="arrow" size={15} /></button><button className="button button-text modal-action" onClick={pickRandomAlbum}>Try another record <Icon name="shuffle" size={15} /></button></>}
            {showAdd && <><p className="eyebrow modal-eyebrow">GROW THE ARCHIVE</p><h2>Add an album</h2><p className="muted">Spotify search will arrive in the next phase. For now, try adding one of these sample records.</p><div className="add-options">{albums.filter((album) => !album.mine).slice(0, 4).map((album) => <div className="add-option" key={album.id}><Artwork album={album} /><span><strong>{album.title}</strong><small>{album.artist}</small></span><button onClick={() => addAlbum(album)} aria-label={`Add ${album.title}`}><Icon name="plus" /></button></div>)}</div></>}
          </section>
        </div>
      )}
      {toast && <div className="toast"><Icon name="check" size={16} />{toast}</div>}
    </div>
  )
}

export default App
