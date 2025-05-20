FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY gradlew settings.gradle* build.gradle* gradle.properties* ./
COPY gradle ./gradle
RUN chmod +x gradlew

COPY . .

RUN ./gradlew bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]
