default:

docker-backend:
	docker build -t registry.gitlab.com/ramonfabrega/idb/backend -f ./src/Dockerfile .
	docker login -u gitlab-ci-token -p $CI_JOB_TOKEN registry.gitlab.com
	docker push registry.gitlab.com/ramonfabrega/idb/backend

test:
	python testing/test_backend.py