import './Game.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiRoot from '../../utils/sdkClient';

function Game() {
    const { gameId } = useParams();
    const gameImages: string[] = [];

    useEffect(() => {
        if (!gameId) return;

        try {
            let idAsString = '';
            if (gameId) {
                idAsString = gameId;
            }
            apiRoot
                .products()
                .withId({ ID: idAsString })
                .get()
                .execute()
                .then(({ body }) => {
                    console.log(body.masterData.staged.masterVariant);
                    if (body.masterData.staged.masterVariant.images) {
                        body.masterData.staged.masterVariant.images.forEach(
                            ({ url }) => {
                                gameImages.push(url);
                            }
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error fetching game:', error);
                });
        } catch (error) {
            console.error('Error fetching game:', error);
        }
        console.log(gameImages);
    });

    return <div className="authContainer">Game page: {gameId}</div>;
}

export default Game;
