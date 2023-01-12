const {
    describe,
    expect,
    test,
    beforeAll,
    afterAll,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");

//Example of an acceptable media object:
const exampleMedia = {
    date_started: "2022-01-01",
    date_finished: "2022-01-01",
    rating: 1,
    title: "Test Media",
    type_id: 1,
};

//Media endpoint tests
//Tests for GET endpoint
describe("GET media endpoint", () => {
    test("should return 200", (done) => {
        request(app).get("/api/media").expect(200).end(done);
    });

    test("should return valid JSON", async () => {
        const response = await request(app)
            .get("/api/media")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    date_started: "2022-11-12T22:00:00.000Z",
                    date_finished: "2022-11-19T22:00:00.000Z",
                    rating: 10,
                    title: "Girls Last Tour",
                    type: "Manga",
                }),
            ])
        );
    });

    test("should return 1 piece of media", async () => {
        const response = await request(app)
            .get("/api/media/1")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                date_started: "2022-11-12T22:00:00.000Z",
                date_finished: "2022-11-19T22:00:00.000Z",
                rating: 10,
                title: "Girls Last Tour",
                type: "Manga",
            })
        );
    });

    test("should return 404 and Not Found", async () => {
        const response = await request(app).get("/api/media/10001");
        expect(response.status).toEqual(404);
        expect(response.text).toContain("Not Found");
    });
});

//Tests for the POST endpoint
describe("POST media endpoint", () => {
    test("should create a new piece of media", async () => {
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(exampleMedia);
        expect(response.status).toEqual(201);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.id).toBeTruthy();
        expect(response.body.date_started).toEqual("2022-01-01");
        expect(response.body.date_finished).toEqual("2022-01-01");
        expect(response.body.rating).toEqual(1);
        expect(response.body.title).toEqual("Test Media");
        expect(response.body.type_id).toEqual(1);
        await request(app).delete(`/api/media/${response.body.id}`);
    });

    test("should not allow other than iso format dates", async () => {
        const pieceOfMedia = {
            date_started: "2022/01/01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"date_started" must be in iso format`);
    });

    test("should not allow ratings less than 1", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 0,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"rating" must be greater than 0`);
    });

    test("should not allow ratings greater than 10", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 11,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"rating" must be less than 11`);
    });

    test("should not allow empty title", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "",
            type_id: 1,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"title" is not allowed to be empty`);
    });

    test("should not allow no title", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            type_id: 1,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"title" is required`);
    });

    test("should not allow no type_id", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"type_id" is required`);
    });

    test("should not allow duplicate titles", async () => {
        const pieceOfMedia = {
            title: "Girls Last Tour",
            type_id: 1,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`No duplicate titles allowed`);
    });

    test("should not allow type_id that doesn't correspond to an existing type", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1000001,
        };
        const response = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(
            "Type_id must be of an existing type's id"
        );
    });
});

//Tests for UPDATE endpoint
describe("PUT media endpoint", () => {
    let postId;
    beforeAll(async () => {
        const postResponse = await request(app)
            .post("/api/media")
            .send(exampleMedia);

        postId = postResponse.body.id;
    });

    test("should update media by id", async () => {
        const pieceOfMedia = {
            id: postId,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .put(`/api/media`)
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(200);
        expect(response.body.id).toEqual(postId);
        expect(response.body.title).toEqual(pieceOfMedia.title);
        expect(response.body.rating).toEqual(pieceOfMedia.rating);
        expect(response.body.type_id).toEqual(pieceOfMedia.type_id);
    });

    test("should check that media with id exists", async () => {
        const pieceOfMedia = {
            id: 100000000,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(404);
        expect(response.text).toEqual("Not Found");
    });

    test("should not allow no id", async () => {
        const pieceOfMedia = {
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual(`"id" is required`);
    });

    test("should not allow non integer id", async () => {
        const pieceOfMedia = {
            id: 102.1,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1,
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual(`"id" must be an integer`);
    });

    test("should not allow no title", async () => {
        const pieceOfMedia = {
            id: postId,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            type_id: 1,
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual(`"title" is required`);
    });

    test("should not allow empty title", async () => {
        const pieceOfMedia = {
            id: postId,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "",
            type_id: 1,
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual(`"title" is not allowed to be empty`);
    });

    test("should not allow no type_id", async () => {
        const pieceOfMedia = {
            id: postId,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual(`"type_id" is required`);
    });

    test("should not allow type_id that doesn't correspond to an existing type", async () => {
        const pieceOfMedia = {
            id: postId,
            date_started: "2022-01-01",
            date_finished: "2022-01-01",
            rating: 1,
            title: "Test Media",
            type_id: 1000001,
        };
        const response = await request(app)
            .put("/api/media")
            .set("Accept", "application/json")
            .send(pieceOfMedia);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(
            "Type_id must be of an existing type's id"
        );
    });

    afterAll(async () => {
        await request(app)
            .delete(`/api/media/${postId}`)
            .set("Accept", "application/json");
    });
});

//Tests for DELETE endpoint
describe("DELETE media endpoint", () => {
    test("should delete a piece of media by id", async () => {
        const postResponse = await request(app)
            .post("/api/media")
            .set("Accept", "application/json")
            .send(exampleMedia);
        const postId = postResponse.body.id;
        const response = await request(app)
            .delete(`/api/media/${postId}`)
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.text).toEqual("Media deleted successfully");
    });

    test("media with id should exist", async () => {
        const response = await request(app)
            .delete("/api/media/10001")
            .set("Accept", "application/json");
        expect(response.status).toEqual(404);
        expect(response.text).toEqual("Not Found");
    });
});

//Type tests
//Tests for GET endpoint
describe("GET types endpoint", () => {
    test("should return 200", (done) => {
        request(app).get("/api/types").expect(200).end(done);
    });

    test("should return valid JSON", async () => {
        const response = await request(app)
            .get("/api/types")
            .set("Accept", "application/json");

        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    type: "Manga",
                }),
            ])
        );
    });

    test("should return 1 type", async () => {
        const response = await request(app)
            .get("/api/media/1")
            .set("Accept", "application/json");

        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                type: "Manga",
            })
        );
    });

    test("should return 404 and Not Found", async () => {
        const response = await request(app).get("/api/types/10001");

        expect(response.status).toEqual(404);
        expect(response.text).toContain("Not Found");
    });
});

//Tests for POST endpoint
describe("POST types endpoint", () => {
    test("should create new type", async () => {
        const type = {
            type: "Test type",
        };
        const response = await request(app)
            .post("/api/types")
            .set("Accept", "application/json")
            .send(type);

        expect(response.status).toEqual(201);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.id).toBeTruthy();
        expect(response.body.type).toEqual("Test type");
        await request(app).delete(`/api/types/${response.body.id}`);
    });

    test("should not allow duplicates", async () => {
        const type = {
            type: "Manga",
        };
        const response = await request(app)
            .post("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(400);
        expect(response.text).toContain("A type by that name already exists");
    });

    test("should not allow no type name", async () => {
        const type = {};
        const response = await request(app)
            .post("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"type" is required`);
    });

    test("should not allow empty type name", async () => {
        const type = {
            type: "",
        };
        const response = await request(app)
            .post("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(`"type" is not allowed to be empty`);
    });

    test("should not allow too short type name", async () => {
        const type = {
            type: "d",
        };
        const response = await request(app)
            .post("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(400);
        expect(response.text).toContain(
            `"type" length must be at least 2 characters long`
        );
    });
});

//Tests for PUT endpoint
describe("PUT types endpoint", () => {
    let postId;
    beforeAll(async () => {
        const type = {
            type: "Test type",
        };
        const postResponse = await request(app).post("/api/types").send(type);
        postId = postResponse.body.id;
    });

    test("should update type by id", async () => {
        const type = {
            id: postId,
            type: "Testing",
        };
        const response = await request(app)
            .put(`/api/types`)
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(200);
        expect(response.body.id).toEqual(postId);
        expect(response.body.type).toEqual(type.type);
    });

    test("should check that type with id exists", async () => {
        const type = {
            id: 100000000,
            type: "Testing",
        };
        const response = await request(app)
            .put("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(404);
        expect(response.text).toEqual("Not Found");
    });

    test("should not allow duplicate names", async () => {
        const type = {
            id: postId,
            type: "Testing",
        };
        const response = await request(app)
            .put("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual("A type by that name already exists");
    });

    test("should not allow no type", async () => {
        const type = {
            id: postId,
        };
        const response = await request(app)
            .put("/api/types")
            .set("Accept", "application/json")
            .send(type);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual(`"type" is required`);
    });

    afterAll(async () => {
        await request(app)
            .delete(`/api/types/${postId}`)
            .set("Accept", "application/json");
    });
});

//Tests for DELETE endpoint
describe("DELETE types endpoint", () => {
    test("should delete type by id", async () => {
        const type = {
            type: "Test",
        };
        const postResponse = await request(app)
            .post("/api/types")
            .set("Accept", "application/json")
            .send(type);
        const postId = postResponse.body.id;
        const response = await request(app)
            .delete(`/api/types/${postId}`)
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.text).toEqual("Type deleted successfully");
    });

    test("type with id should exist", async () => {
        const response = await request(app)
            .delete("/api/types/10001")
            .set("Accept", "application/json");
        expect(response.status).toEqual(404);
        expect(response.text).toEqual("Not Found");
    });
});
