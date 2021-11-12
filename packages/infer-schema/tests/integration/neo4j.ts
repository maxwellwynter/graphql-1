/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as neo4j from "neo4j-driver";
import * as util from "util";

let driver;

async function connect(username?: string, password?: string, boltUrl?: string): Promise<neo4j.Driver> {
    if (driver) {
        return driver;
    }

    const { NEO_USER = "admin", NEO_PASSWORD = "password", NEO_URL = "neo4j://localhost:7687/neo4j" } = process.env;
    const user = username || NEO_USER;
    const pass = password || NEO_PASSWORD;
    const url = boltUrl || NEO_URL;

    if (process.env.NEO_WAIT && !driver) {
        await util.promisify(setTimeout)(Number(process.env.NEO_WAIT));
    }

    const auth = neo4j.auth.basic(user, pass);

    driver = neo4j.driver(url, auth);

    try {
        await driver.verifyConnectivity();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Could not connect to neo4j @ ${url} Error: ${error.message}`);
        }
    }

    return driver;
}

export default connect;
