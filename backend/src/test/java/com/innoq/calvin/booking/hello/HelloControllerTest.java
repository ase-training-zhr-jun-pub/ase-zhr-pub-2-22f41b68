package com.innoq.calvin.booking.hello;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HelloControllerTest {

	@Test
	void helloReturnsHelloWorld() {
		assertThat(new HelloController().hello()).isEqualTo("Hello World!");
	}
}
