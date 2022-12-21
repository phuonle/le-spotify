import {signOut, useSession} from 'next-auth/react'
import {ChevronDownIcon} from '@heroicons/react/24/outline'
import {useEffect, useState} from 'react'
import {shuffle} from 'lodash'
import {useRecoilState} from 'recoil'
import {playlistIdState, playlistState} from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const DEFAULT_COLOR = 'from-green-500'

const colors = [
    'from-red-500',
    'from-orange-500',
    'from-amber-500',
    'from-yellow-500',
    'from-lime-500',
    'from-green-500',
    'from-emerald-500',
    'from-teal-500',
    'from-cyan-500',
    'from-sky-500',
    'from-blue-500',
    'from-indigo-500',
    'from-violet-500',
    'from-purple-500',
    'from-fuchsia-500',
    'from-pink-500',
    'from-rose-500',
]

function Center() {

    const spotifyApi = useSpotify()
    const [playlistId] = useRecoilState(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    useEffect(() => {
        if (!spotifyApi.getAccessToken()) {
            return
        }

        spotifyApi.getPlaylist(playlistId).then(data => {
            const {body: playlist} = data
            setPlaylist(playlist)
        })
    }, [spotifyApi, playlistId])

    const [color, setColor] = useState(DEFAULT_COLOR)
    useEffect(() => {
        const chosenColor = shuffle(colors).pop() || DEFAULT_COLOR
        setColor(chosenColor)
    }, [playlistId])

    const {data: session} = useSession()
    const user = session?.user
    if (!user || !playlist) {
        return null
    }

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-2 opacity-90 hover:opacity-80
                                cursor-pointer rounded-full p-1 pr-2 bg-black text-white font-bold text-sm"
                     onClick={() => signOut()}
                >
                    <img src={user.image || ''} alt="avatar" className="rounded-full w-6 h-6"/>
                    <h2>{user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8 text-white`}>
                <img
                    className="h-44 w-44 shadow-2xl"
                    src={playlist.images?.[0]?.url}
                    alt="Playlist"
                />
                <div>
                    <p className="text-xs">PLAYLIST</p>
                    <h1 className="text-2xl md:text-4xl xl:text-6xl font-bold select-none">{playlist.name}</h1>
                </div>
            </section>

            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center